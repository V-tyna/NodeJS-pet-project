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
	getInvoice,
} = require('../controllers/mongoose/shop');
const { cartValidators } = require('../utils/validators');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', isAuth, getCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/orders', isAuth,  getOrders);

shopRouter.get('/products', getProducts);

shopRouter.get('/products/:productId', getProductById);

shopRouter.get('/orders/:orderId', isAuth, getInvoice);

shopRouter.post('/cart', isAuth, postCart);

shopRouter.post('/cart/delete', isAuth,  postDeleteProductFromCart);

shopRouter.post('/create-order', isAuth, cartValidators, postOrder);

module.exports = shopRouter;
