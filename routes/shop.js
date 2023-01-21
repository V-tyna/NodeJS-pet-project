const { Router } = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProductById, postCart, postDeleteProductFromCart, postOrder } = require('../controllers/shop');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', getCart);

shopRouter.post('/cart', postCart);

shopRouter.post('/cart/delete', postDeleteProductFromCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', getOrders);

shopRouter.post('/create-order', postOrder);

shopRouter.get('/products', getProducts);

shopRouter.get('/products/:productId', getProductById);

module.exports = shopRouter;
