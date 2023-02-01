const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

const { createToken } = require('../../utils/createToken');

const deepClone = require('../../utils/deepClone');
const getError = require('../../utils/getError');
const Order = require('../../models/mongoose/order');
const Product = require('../../models/mongoose/product');

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
			getError('Get cart error: ', e);
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
			getError('Checkout: ', e);
		}
	},
	getIndex: async (req, res, next) => {
		try {
			createToken(res);
			const products = await Product.find();
			const prods = deepClone(products);
			return res.render('shop/index', {
				activeShop: true,
				isAuthenticated: req.session.isLoggedIn,
				prods,
				pageTitle: 'Home page',
			});
		} catch (e) {
			getError('Get products in index/home page error: ', e);
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

			const invoiceName = 'invoice-' + order._id + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);

			const pdfDoc = new pdfDocument();
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);
			pdfDoc.fontSize(20).text('Invoice', { underline: true });
			pdfDoc.fontSize(14).text(`Order number: ${orderId}`);
			pdfDoc.fontSize(12).text(`Data: ${new Date(order.createdAt).toUTCString()}`);
      pdfDoc.text('______________________________________________________________');
      order.orderData.forEach(prod => {
        pdfDoc.text(`Title: ${prod.title}`);
        pdfDoc.text(`Price: ${prod.price}$`);
        pdfDoc.text(`Quantity: ${prod.quantity}`);
        pdfDoc.text('---');
      });
      pdfDoc.text('______________________________________________________________');
      pdfDoc.text(`Delivery address: ${order.address}`);
			pdfDoc.fontSize(14).text(`Total order price: ${order.totalPrice}`);
			pdfDoc.end();
		} catch (e) {
			getError('Get Invoice error: ', e);
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
			getError('Get Orders error: ', e);
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
			getError('Get products in shop page error: ', e);
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
			getError('Get product by id in detail page error: ', e);
		}
	},
	postCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			const product = await Product.findById(productId);
			await req.user.addToCart(product);
			return res.redirect('/cart');
		} catch (e) {
			getError('Post cart error: ', e);
		}
	},
	postDeleteProductFromCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await req.user.deleteProductFromTheCart(productId);
			return res.redirect('/cart');
		} catch (e) {
			getError('Deleting product from Cart error: ', e);
		}
	},
	postOrder: async (req, res, next) => {
		try {
			const { address } = req.body;

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('errorValidation', errors.array()[0].msg);
				return res.status(422).redirect('/cart');
			}

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
			getError('Making post order error: ', e);
		}
	},
};
