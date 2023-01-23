const Product = require('../../models/mongoDB/product');
const User = require('../../models/mongoDB/user');

const deepClone = require('../../utils/deepClone');

module.exports = {
	getProducts: async (req, res, next) => {
		try {
			const products = await Product.fetchAll();
			const prods = deepClone(products);
			res.render('shop/products-list', {
				prods,
				pageTitle: 'Products list page',
				activeProducts: true,
			});
		} catch (e) {
			console.log('Get products in shop page error: ', e);
		}
	},
	getProductById: async (req, res, next) => {
		try {
			const { productId } = req.params;
			const prod = await Product.findProductById(productId);
			const product = deepClone(prod);
			res.render('shop/product-details', {
				pageTitle: 'Product details page',
				product,
			});
		} catch (e) {
			console.log('Get product by id in detail page error: ', e);
		}
	},
	getIndex: async (req, res, next) => {
		try {
			const products = await Product.fetchAll();
			const prods = deepClone(products);
			return res.render('shop/index', {
				prods,
				pageTitle: 'Home page',
				activeShop: true,
			});
		} catch (e) {
			console.log('Get products in index/home page error: ', e);
		}
	},
	getCart: async (req, res, next) => {
		try {
			const cartProducts = await User.getCart(req.user.cart);
			const products = deepClone(cartProducts).map((el) => {
				return {
					...el,
					quantity: req.user.cart.items.find((item) => {
						return item.productId.toString() === el._id.toString();
					}).quantity,
				};
			});
			return res.render('shop/cart', {
				pageTitle: 'Cart page',
				activeCart: true,
				products,
			});
		} catch (e) {
			console.log('Get cart error: ', e);
		}
	},
	postCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			const product = await Product.findProductById(productId);
			await User.addToCart(req.user, product);
			return res.redirect('/cart');
		} catch (e) {
			console.log('Post cart error: ', e);
		}
	},
	getCheckout: (req, res, next) => {
		try {
			return res.render('shop/checkout', {
				pageTitle: 'Checkout page',
				activeCheckout: true,
			});
		} catch (e) {
			console.log('Checkout: ', e);
		}
	},
	getOrders: async (req, res, next) => {
		try {
			const fetchedOrders = await req.user.getOrders({
				include: ['products'],
			});
			const orders = deepClone(fetchedOrders);
			return res.render('shop/orders', {
				pageTitle: 'Orders page',
				activeOrders: true,
				orders,
			});
		} catch (e) {
			console.log('Get Orders error: ', e);
		}
	},
	postOrder: async (req, res, next) => {
		try {
			const cart = await req.user.getCart();
			const products = await cart.getProducts();
			console.log(
				'Products: ',
				products.map((el) => ({
					title: el.title,
					quantity: el.cartItem.quantity,
				}))
			);
			const order = await req.user.createOrder({
				address: req.body.address,
			});
			await order.addProducts(
				products.map((product) => {
					product.orderItem = { quantity: product.cartItem.quantity };
					return product;
				})
			);
			await cart.setProducts(null);
			return res.redirect('/orders');
		} catch (e) {
			console.log('Making post order error: ', e);
		}
	},
	postDeleteProductFromCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await User.deleteProductFromTheCart(productId, req.user);
			return res.redirect('/cart');
		} catch (e) {
			console.log('Deleting product from Cart error: ', e);
		}
	},
};
