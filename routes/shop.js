const path = require('path');
const { Router } = require('express');

const shopRouter = Router();

shopRouter.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../','views', 'shop.html'));
});

module.exports = shopRouter;
