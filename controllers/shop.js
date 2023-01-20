const Cart = require('../models/cart');
const Product = require('../models/sequelize/product');

const deepClone = require('../utils/deepClone');

module.exports = {
	getProducts: async (req, res, next) => {
    try {
			const products = await req.user.getProducts();
      const prods = deepClone(products);
      res.render('shop/products-list', {
        prods,
        pageTitle: 'Products list page',
        activeProducts: true,
      });
    } catch(e) {
      console.log('Get products in shop page error: ', e);
    }
	},
	getProductById: async (req, res, next) => {
    try {
      const productId = req.params.productId;
			const prod = await req.user.getProducts({ where: { id: productId } });
      const product = deepClone(prod[0]);
      res.render('shop/product-details', {
        pageTitle: 'Product details page',
        product,
      });
    } catch(e) {
      console.log('Get product by id in detail page error: ', e);
    }
	},
	getIndex: async (req, res, next) => {
    try {
			const products = await req.user.getProducts();
      const prods = deepClone(products);
      res.render('shop/index', {
        prods,
        pageTitle: 'Home page',
        activeShop: true,
      });
    } catch(e) {
      console.log('Get products in index/home page error: ', e);
    }
	},
	getCart: async (req, res, next) => {
		try {
			const cart = await req.user.getCart();
			const cartProducts = await cart.getProducts();
			const products = deepClone(cartProducts).map(el => {
				return { ...el, quantity: el.cartItem.quantity };
			});
			res.render('shop/cart', {
				pageTitle: 'Cart page',
				activeCart: true,
				products,
			});
		} catch(e) {
			console.log('Get cart error: ', e);
		}
	},
	postCart: async (req, res, next) => {
		try {
			const { productId } = req.body;
			const cart = await req.user.getCart();
			const existedProducts = await cart.getProducts({ where: { id: productId }});
			let product = existedProducts[0];
			let newQuantity = 1;
			if (existedProducts.length) {
				newQuantity = product.cartItem.quantity + 1;
			} else {
				product = await Product.findByPk(productId);
			}
			await cart.addProduct(product, { through: { quantity: newQuantity }});
			res.redirect('/cart');
		} catch(e) {
			console.log('Post cart error: ', e);
		}
	},
	getCheckout: (req, res, next) => {
		res.render('shop/checkout', {
			pageTitle: 'Checkout page',
			activeCheckout: true,
		});
	},
	getOrders: async (req, res, next) => {
		res.render('shop/orders', {
			pageTitle: 'Orders page',
			activeCart: true,
		});
	},
	postDeleteProductFromCart: async (req, res, next) => {
		const { productId, price } = req.body;
		await Cart.deleteProductFromCart(productId, price);
		res.redirect('/cart');
	},
};
