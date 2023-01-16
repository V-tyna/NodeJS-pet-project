const Product = require('../models/product');

module.exports = {
  getProducts: async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/products-list', {
      prods: products,
      pageTitle: 'Products list page',
      activeProducts: true
    });
  },
  getIndex: async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Home page',
      activeShop: true
    });
  },
  getCart: async (req, res, next) => {
    res.render('shop/cart', {
      pageTitle: 'Cart page',
      activeCart: true
    });
  },
  getCheckout: (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout page',
      activeCheckout: true
    });
  }
};
