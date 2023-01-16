const { Router } = require('express');
const { getProducts, getIndex, getCart, getCheckout } = require('../controllers/shop');

const shopRouter = Router();

shopRouter.get('/', getIndex);

shopRouter.get('/cart', getCart);

shopRouter.get('/checkout', getCheckout);

shopRouter.get('/products', getProducts);

module.exports = shopRouter;
