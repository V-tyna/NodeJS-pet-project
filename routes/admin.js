
const path = require('path');
const { Router } = require('express');

const rootDirectory = require('../util/path');

const adminRouter = Router();

adminRouter.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'));
});

adminRouter.post('/add-product', (req, res, next) => {
  console.log('Request body: ', req.body);
  res.redirect('/');
});

module.exports = adminRouter;