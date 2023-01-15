
const path = require('path');
const { Router } = require('express');

const rootDirectory = require('../util/path');

const adminRouter = Router();
const products = [];

adminRouter.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add product page',
    path: '/admin/add-product',
    activeAddProd: true,
    productCSS: true
  });
});

adminRouter.post('/add-product', (req, res, next) => {
  console.log('Request body: ', req.body);
  products.push({title: req.body.title});
  res.redirect('/');
});

module.exports = {
  adminRouter,
  products
};
