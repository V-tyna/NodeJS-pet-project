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

shopRouter.post('/cart', isAuth,  postCart);

shopRouter.post('/cart/delete', isAuth,  postDeleteProductFromCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', isAuth,  getOrders);

shopRouter.post('/create-order', isAuth,  postOrder);

shopRouter.get('/products', getProducts);

shopRouter.get('/products/:productId', getProductById);

module.exports = shopRouter;
