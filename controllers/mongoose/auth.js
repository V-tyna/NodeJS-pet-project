const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const {
	sendSignupEmail,
	sendResetPasswordEmail,
} = require('../../utils/sendEmail');
const { createToken } = require('../../utils/createToken');

const getError = require('../../utils/getError');
const User = require('../../models/mongoose/user');

module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			const data = req.flash('userData');
			createToken(res);
			return res.render('auth/login', {
				errorMessage: req.flash('errorValidation'),
				formCSS: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Login Page',
				userData: data ? data[0] : null,
				validationErrors: req.flash('validationErrors'),
			});
		} catch (e) {
			getError('Login page rendering error: ', e);
		}
	},
	getResetPage: (req, res, next) => {
		try {
			createToken(res);
			return res.render('auth/reset', {
				errorMessage: req.flash('error'),
				isAuthenticated: req.session.isLoggedIn,
				formCSS: true,
				pageTitle: 'Reset password Page',
			});
		} catch (e) {
			getError('Reset password render error: ', e);
		}
	},
	getResetAccessPage: async (req, res, next) => {
		try {
			createToken(res);
			const token = req.params.token;
			const user = await User.findOne({
				resetToken: token,
				resetTokenExp: { $gt: Date.now() },
			});
			if (user) {
				return res.render('auth/resetAccess', {
					isAuthenticated: req.session.isLoggedIn,
					errorMessage: req.flash('error'),
					formCSS: true,
					pageTitle: 'Reset Access Page',
					userId: user._id.toString(),
					token,
				});
			} else {
				req.flash('error', 'User not found or token has been expired.');
				res.redirect('/reset');
			}
		} catch (e) {
			getError('Reset access page render error: ', e);
		}
	},
	getSignupPage: (req, res, next) => {
		try {
			const data = req.flash('userData');
			createToken(res);
			return res.render('auth/signup', {
				errorValidation: req.flash('errorValidation'),
				formCSS: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Signup Page',
				userData: data ? data[0] : null,
				validationErrors: req.flash('validationErrors'),
			});
		} catch (e) {
			getError('Sign up render error: ', e);
		}
	},
	postLoginPage: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('validationErrors', errors.array());
				req.flash('userData', { email, password });
				req.flash('errorValidation', errors.array()[0].msg);
				return res.status(422).redirect('/login');
			} 

			return res.redirect('/');
		} catch (e) {
			getError('Login page rendering error: ', e);
		}
	},
	postLogout: async (req, res, next) => {
		try {
			req.session.isLoggedIn = false;
			await req.session.destroy();
			return res.redirect('/');
		} catch (e) {
			getError('Logout error: ', e);
		}
	},
	postResetAccess: async (req, res, next) => {
		try {
			const { password, repeated_password, token, userId } = req.body;
			if (password === repeated_password) {
				const user = await User.findOne({
					resetToken: token,
					resetTokenExp: { $gt: Date.now() },
					_id: userId,
				});
				if (user) {
					const hashPassword = await bcrypt.hash(password, 12);
					user.password = hashPassword;
					await user.save();
				} else {
					req.flash('error', 'User not found or token has been expired.');
					return res.redirect('/reset');
				}
				return res.redirect('/login');
			} else {
				req.flash('error', 'Passwords do not match');
				return res.redirect(`/reset/${token}`);
			}
		} catch (e) {
			getError('POST reset access page error: ', e);
		}
	},
	postResetPage: async (req, res, next) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email: email });
			if (!user) {
				req.flash('error', `User with such email ${email} does not exist.`);
				res.redirect('/reset');
			} else {
				crypto.randomBytes(32, async (err, buffer) => {
					if (err) {
						req.flash(
							'error',
							'Something went wrong, please try again later...'
						);
						return res.redirect('/reset');
					} else {
						const token = buffer.toString('hex');
						user.resetToken = token;
						user.resetTokenExp = Date.now() + 900000;
						await user.save();
						sendResetPasswordEmail(email, user.name, token);
						return res.redirect('/');
					}
				});
			}
		} catch (e) {
			getError('POST reset page error: ', e);
		}
	},
	postSignup: async (req, res, next) => {
		try {
			const { email, userName, password, repeated_password } = req.body;
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('validationErrors', errors.array());
				req.flash('userData', { email, userName, password, repeated_password });
				req.flash('errorValidation', errors.array()[0].msg);
				return res.status(422).redirect('/signup');
			}

			const hashPassword = await bcrypt.hash(password, 12);
			const user = new User({
				cart: { items: [] },
				email,
				name: userName,
				password: hashPassword,
			});
			await user.save();

			sendSignupEmail(email, userName);

			return res.redirect('/login');
		} catch (e) {
			getError('Sign up post error: ', e);
		}
	},
};
