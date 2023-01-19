const Cart = require('../models/cart');
const Product = require('../models/productSequelize'); // Sequelize

const deepClone = require('../utils/deepClone');

module.exports = {
	getProducts: async (req, res, next) => {
    try {
      const products = await Product.findAll();
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
      const prod = await Product.findByPk(productId);
      const product = deepClone(prod);
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
      const products = await Product.findAll();
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
		const cart = await Cart.fetchAll();
		// const prods = cart.products[0].map(el => ({...products.find(product => product.id === el.id), quantity: el.quantity }));
		res.render('shop/cart', {
			pageTitle: 'Cart page',
			activeCart: true,
			products: prods,
		});
	},
	postCart: async (req, res, next) => {
		const { productId } = req.body;
		// const cart = await Cart.addProduct(productId, product[0][0].price);
		res.redirect('/cart');
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
