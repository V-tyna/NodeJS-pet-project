const Order = require('../../models/mongoose/order');
const Product = require('../../models/mongoose/product');
const User = require('../../models/mongoose/user');

const deepClone = require('../../utils/deepClone');

module.exports = {
	getProducts: async (req, res, next) => {
		try {
			const products = await Product.find();
			const prods = deepClone(products);
			res.render('shop/products-list', {
				activeProducts: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Products list page',
				prods,
			});
		} catch (e) {
			console.log('Get products in shop page error: ', e);
		}
	},
	getProductById: async (req, res, next) => {
		try {
			const { productId } = req.params;
			const prod = await Product.findById(productId);
			const product = deepClone(prod);
			res.render('shop/product-details', {
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Product details page',
				product,
			});
		} catch (e) {
			console.log('Get product by id in detail page error: ', e);
		}
	},
	getIndex: async (req, res, next) => {
		try {
			const products = await Product.find();
			const prods = deepClone(products);
			console.log('AUTH: ', req.session.isLoggedIn);
			return res.render('shop/index', {
				activeShop: true,
				isAuthenticated: req.session.isLoggedIn,
				prods,
				pageTitle: 'Home page',
			});
		} catch (e) {
			console.log('Get products in index/home page error: ', e);
		}
	},
	getCart: async (req, res, next) => {
		try {
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
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Cart page',
				products,
			});
		} catch (e) {
			console.log('Get cart error: ', e);
		}
	},
	postCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			const product = await Product.findById(productId);
			await req.user.addToCart(product);
			return res.redirect('/cart');
		} catch (e) {
			console.log('Post cart error: ', e);
		}
	},
	getCheckout: (req, res, next) => {
		try {
			return res.render('shop/checkout', {
				activeCheckout: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Checkout page',
			});
		} catch (e) {
			console.log('Checkout: ', e);
		}
	},
	getOrders: async (req, res, next) => {
		try {
			const fetchedOrders = await Order.find({ userId: req.user._id });
			const orders = deepClone(fetchedOrders);
			return res.render('shop/orders', {
				activeOrders: true,
				isAuthenticated: req.session.isLoggedIn,
				orders,
				pageTitle: 'Orders page',
			});
		} catch (e) {
			console.log('Get Orders error: ', e);
		}
	},
	postOrder: async (req, res, next) => {
		try {
			const { address } = req.body;
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
			return res.redirect('/orders');
		} catch (e) {
			console.log('Making post order error: ', e);
		}
	},
	postDeleteProductFromCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await req.user.deleteProductFromTheCart(productId);
			return res.redirect('/cart');
		} catch (e) {
			console.log('Deleting product from Cart error: ', e);
		}
	},
};
