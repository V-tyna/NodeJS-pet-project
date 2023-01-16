const { Router } = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders } = require('../controllers/shop');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', getCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', getOrders);

shopRouter.get('/products', getProducts);

module.exports = shopRouter;
