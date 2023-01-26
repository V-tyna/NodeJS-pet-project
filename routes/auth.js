const { Router } = require('express');
const { getLoginPage, postLoginPage, postLogout, getSignupPage, postSignup } = require('../controllers/mongoose/auth');

const authRouter = Router();

authRouter.get('/login', getLoginPage);

authRouter.get('/logout', postLogout);

authRouter.get('/signup', getSignupPage);

authRouter.post('/login', postLoginPage);

authRouter.post('/signup', postSignup);

module.exports = authRouter;
