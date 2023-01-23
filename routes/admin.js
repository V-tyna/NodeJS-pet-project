const { Router } = require('express');
const {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct,
} = require('../controllers/mongoDB/admin');

const adminRouter = Router();

adminRouter.get('/add-product', getAddProduct);

adminRouter.get('/products-list', getProducts);

adminRouter.post('/add-product', postAddProduct);

adminRouter.get('/edit-product/:productId', getEditProduct);

adminRouter.post('/edit-product', postEditProduct);

adminRouter.post('/delete-product', postDeleteProduct);

module.exports = adminRouter;
