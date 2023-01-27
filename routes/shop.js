const { Router } = require('express');

const isAuth = require('../middleware/isAuth');
const {
	getProducts,
	getIndex,
	getCart,
	getCheckout,
	getOrders,
	getProductById,
	postCart,
	postDeleteProductFromCart,
	postOrder,
} = require('../controllers/mongoose/shop');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', isAuth, getCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', isAuth,  getOrders);

shopRouter.get('/products', getProducts);

shopRouter.get('/products/:productId', getProductById);

shopRouter.post('/cart', isAuth,  postCart);

shopRouter.post('/cart/delete', isAuth,  postDeleteProductFromCart);

shopRouter.post('/create-order', isAuth,  postOrder);

module.exports = shopRouter;
