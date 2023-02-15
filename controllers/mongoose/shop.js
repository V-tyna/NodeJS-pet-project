const { validationResult } = require('express-validator');

const { createToken } = require('../../utils/createToken');

const keys = require('../../configs/keys');
const stripe = require('stripe')(keys.STRIPE_SECURE_KEY);

const createPDF = require('../../configs/createPDF');
const deepClone = require('../../utils/deepClone');
const getError = require('../../utils/getError');
const Order = require('../../models/mongoose/order');
const Product = require('../../models/mongoose/product');

const ITEMS_PER_PAGE = 3;

module.exports = {
	getCart: async (req, res, next) => {
		try {
			createToken(res);
			const user = await req.user.populate(['cart.items.productId']);
			const cartProducts = user.cart.items.map((el) => ({
				_id: el.productId._id,
				description: el.productId.description,
				imageUrl: el.productId.imageUrl,
				price: el.productId.price,
				title: el.productId.title,
				quantity: el.quantity,
			}));
			const products = deepClone(cartProducts);
			return res.render('shop/cart', {
				activeCart: true,
				errorMessage: req.flash('errorValidation'),
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Cart page',
				products,
			});
		} catch (e) {
			getError('Get cart error: ', e, next);
		}
	},
	getCheckout: async (req, res, next) => {
		try {
			createToken(res);

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('errorValidation', errors.array()[0].msg);
				return res.status(422).redirect('/cart');
			}

			const user = await req.user.populate(['cart.items.productId']);
			user.delivery_address = req.body.address;
			await user.save();
		
			const line_items = user.cart.items.map((prod) => ({
				price_data: {
					currency: 'usd',
					product_data: { name: prod.productId.title },
					unit_amount: Math.round(prod.productId.price * 100),
				},
				quantity: prod.quantity,
			}));

			const session = await stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items,
				mode: 'payment',
				customer_email: req.user.email,
				success_url:
					req.protocol +
					'://' +
					req.get('host') +
					'/checkout/success?session_id={CHECKOUT_SESSION_ID}',
				cancel_url:
					req.protocol + '://' + req.get('host') + '/checkout/cancel',
			});

			return res.render('shop/checkout', {
				checkoutCSS: true,
				errorMessage: req.flash('errorValidation'),
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Checkout page',
				products,
				sessionId: session.id,
			});
		} catch (e) {
			getError('Checkout: ', e, next);
		}
	},
	getCheckoutSuccess: async (req, res, next) => {
		try {
			const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
			console.log('SESSION: ', session)
			const address = req.user.delivery_address;

			if (session.payment_status === 'paid') {

			const user = await req.user.populate(['cart.items.productId']);
			const cartProducts = user.cart.items.map((el) => ({
				description: el.productId.description,
				imageUrl: el.productId.imageUrl,
				price: +el.productId.price,
				productId: el.productId._id.toString(),
				title: el.productId.title,
				quantity: el.quantity,
			}));
			const totalPrice = cartProducts
				.reduce((acc, el) => (acc += el.quantity * el.price), 0)
				.toFixed(2);
			const order = new Order({
				address,
				createdAt: new Date(),
				orderData: cartProducts,
				totalPrice,
				userId: req.user._id,
			});
			await order.save();
			await req.user.cleanCart();
			await req.user.cleanDeliveryAddress();
			return res.redirect('/orders');
		} else {
			req.flash('errorValidation', 'Payment failed.');
			return res.redirect('/cart');
		}
		} catch (e) {
			getError('Making post order error: ', e, next);
		}
	},
	getIndex: async (req, res, next) => {
		try {
			createToken(res);

			const { page } = req.query;
			const totalProducts = await Product.find().countDocuments();
			const products = await Product.find()
				.skip((+page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);

			const prods = deepClone(products);
			return res.render('shop/index', {
				activeShop: true,
				currentPage: +page || 1,
				hasNextPage: totalProducts > +page * ITEMS_PER_PAGE,
				hasPreviousPage: +page > 1,
				isAuthenticated: req.session.isLoggedIn,
				lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
				nextPage: +page + 1,
				pageTitle: 'Home page',
				previousPage: +page - 1,
				prods,
			});
		} catch (e) {
			getError('Get products in index/home page error: ', e, next);
		}
	},
	getInvoice: async (req, res, next) => {
		try {
			const { orderId } = req.params;
			const order = await Order.findById(orderId);

			if (!order) {
				return next(new Error('No order found!'));
			}
			if (order.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Unauthorized!'));
			}

			createPDF(order, res);
		} catch (e) {
			getError('Get Invoice error: ', e, next);
		}
	},
	getOrders: async (req, res, next) => {
		try {
			createToken(res);
			const fetchedOrders = await Order.find({ userId: req.user._id });
			const orders = deepClone(fetchedOrders);
			return res.render('shop/orders', {
				activeOrders: true,
				isAuthenticated: req.session.isLoggedIn,
				orders,
				pageTitle: 'Orders page',
			});
		} catch (e) {
			getError('Get Orders error: ', e, next);
		}
	},
	getProducts: async (req, res, next) => {
		try {
			createToken(res);
			const products = await Product.find();
			const prods = deepClone(products);
			res.render('shop/products-list', {
				activeProducts: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Products list page',
				prods,
			});
		} catch (e) {
			getError('Get products in shop page error: ', e, next);
		}
	},
	getProductById: async (req, res, next) => {
		try {
			createToken(res);
			const { productId } = req.params;
			const prod = await Product.findById(productId);
			const product = deepClone(prod);
			res.render('shop/product-details', {
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Product details page',
				product,
			});
		} catch (e) {
			getError('Get product by id in detail page error: ', e, next);
		}
	},
	postCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			const product = await Product.findById(productId);
			await req.user.addToCart(product);
			return res.redirect('/cart');
		} catch (e) {
			getError('Post cart error: ', e, next);
		}
	},
	postDeleteProductFromCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await req.user.deleteProductFromTheCart(productId);
			return res.redirect('/cart');
		} catch (e) {
			getError('Deleting product from Cart error: ', e, next);
		}
	},
};
