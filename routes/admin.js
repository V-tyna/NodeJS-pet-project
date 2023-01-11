
const path = require('path');
const { Router } = require('express');

const adminRouter = Router();

adminRouter.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

adminRouter.post('/add-product', (req, res, next) => {
  console.log('Request body: ', req.body);
  res.redirect('/');
});

module.exports = adminRouter;