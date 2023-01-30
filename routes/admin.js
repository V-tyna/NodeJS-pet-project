const { Router } = require('express');

const isAuth = require('../middleware/isAuth');
const {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct,
} = require('../controllers/mongoose/admin');
const { productValidators } = require('../utils/validators');

const adminRouter = Router();

adminRouter.get('/add-product', isAuth, getAddProduct);

adminRouter.get('/edit-product/:productId', isAuth, getEditProduct);

adminRouter.get('/products-list', isAuth, getProducts);

adminRouter.post('/add-product',isAuth, productValidators, postAddProduct);

adminRouter.post('/edit-product', isAuth, productValidators, postEditProduct);

adminRouter.post('/delete-product', isAuth, postDeleteProduct);

module.exports = adminRouter;
