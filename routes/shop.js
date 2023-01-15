// const path = require('path');
const { Router } = require('express');

const { products } = require('./admin');
// const rootDirectory = require('../util/path');

const shopRouter = Router();

shopRouter.get('/', (req, res, next) => {
  console.log('Products in shop page: ', products);
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop page',
    activeShop: true,
    path: '/'
  });
  // res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
});

module.exports = shopRouter;
