const { Router } = require('express');

const {
	getLoginPage,
	postLoginPage,
	postLogout,
	getSignupPage,
	postSignup,
	getResetPage,
	postResetPage,
	getResetAccessPage,
	postResetAccess,
} = require('../controllers/mongoose/auth');
const { signupValidators, loginValidators } = require('../utils/validators');

const authRouter = Router();

authRouter.get('/login', getLoginPage);

authRouter.get('/logout', postLogout);

authRouter.get('/reset', getResetPage);

authRouter.get('/reset/:token', getResetAccessPage);

authRouter.get('/signup', getSignupPage);

authRouter.post('/login', loginValidators, postLoginPage);

authRouter.post('/reset', postResetPage);

authRouter.post('/reset/:token', postResetAccess);

authRouter.post('/signup', signupValidators, postSignup);

module.exports = authRouter;
