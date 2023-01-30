const { Router } = require('express');

const { get500Page } = require('../controllers/error');

const errorRouter = Router();

errorRouter.get('/500', get500Page);

module.exports = errorRouter;
