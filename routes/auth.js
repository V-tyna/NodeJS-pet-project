const { Router } = require('express');
const { getLoginPage, postLoginPage, postLogout } = require('../controllers/mongoose/auth');

const authRouter = Router();

authRouter.get('/login', getLoginPage);

authRouter.post('/login', postLoginPage);

authRouter.get('/logout', postLogout);

module.exports = authRouter;
