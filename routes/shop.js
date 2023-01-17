const { Router } = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProductById, postCart } = require('../controllers/shop');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', getCart);

shopRouter.post('/cart', postCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', getOrders);

shopRouter.get('/products', getProducts);

shopRouter.get('/products/:productId', getProductById);

module.exports = shopRouter;
