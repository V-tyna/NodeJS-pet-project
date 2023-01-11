const path = require('path');
const { Router } = require('express');

const rootDirectory = require('../util/path');

const shopRouter = Router();

shopRouter.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
});

module.exports = shopRouter;
