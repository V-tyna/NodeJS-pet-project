const Cart = require('../models/cart');
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
  getProductById: async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findProductById(productId);
    res.render('shop/product-details', {
      pageTitle: 'Product details page',
      product
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
    const cart = await Cart.fetchAll();
    const products  = await Product.fetchAll();
    const prods = cart.products.map(el => ({...products.find(product => product.id === el.id), quantity: el.quantity }));
    res.render('shop/cart', {
      pageTitle: 'Cart page',
      activeCart: true,
      products: prods
    });
  },
  postCart: async (req, res, next) => {
    const productId = req.body.productId;
    const product = await Product.findProductById(productId);
    const cart = await Cart.addProduct(productId, product.price);
    res.redirect('/cart');
  },
  getCheckout: (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout page',
      activeCheckout: true
    });
  },
  getOrders: async (req, res, next) => {
    res.render('shop/orders', {
      pageTitle: 'Orders page',
      activeCart: true
    });
  },
  postDeleteProductFromCart: async (req, res, next) => {
    const { productId, price } = req.body;
    await Cart.deleteProductFromCart(productId, price);
    res.redirect('/cart');
  }
};
