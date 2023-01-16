
const { Router } = require('express');
const { getAddProduct, postAddProduct, getProducts } = require('../controllers/admin');

const adminRouter = Router();

adminRouter.get('/add-product', getAddProduct);

adminRouter.get('/products-list', getProducts);

adminRouter.post('/add-product', postAddProduct);

module.exports = adminRouter;
