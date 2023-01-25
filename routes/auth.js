const { Router } = require('express');
const { getLoginPage, postLoginPage } = require('../controllers/mongoose/auth');

const authRouter = Router();

authRouter.get('/login', getLoginPage);

authRouter.post('/login', postLoginPage);

module.exports = authRouter;
