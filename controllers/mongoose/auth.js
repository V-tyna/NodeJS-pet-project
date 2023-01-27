const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const { createMessage } = require('../../configs/sendGridMessage');
const { createToken } = require('../../utils/createToken');
const { SENDGRID_API_KEY } = require('../../configs/keys.dev');

const User = require('../../models/mongoose/user');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			createToken(res);
			return res.render('auth/login', {
				errorMessage: req.flash('error'),
				isAuthenticated: req.session.isLoggedIn,
				formCSS: true,
				pageTitle: 'Login Page',
			});
		} catch (e) {
			console.log('Login page rendering error: ', e);
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
			console.log('Reset password render error: ', e);
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
			console.log('Reset access page render error: ', e);
		}
	},
	getSignupPage: (req, res, next) => {
		try {
			createToken(res);
			return res.render('auth/signup', {
				errorUserExists: req.flash('errorUserExists'),
				errorPassword: req.flash('errorPassword'),
				isAuthenticated: req.session.isLoggedIn,
				formCSS: true,
				pageTitle: 'Signup Page',
			});
		} catch (e) {
			console.log('Sign up render error: ', e);
		}
	},
	postLoginPage: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email: email });
			if (user) {
				const doMatch = await bcrypt.compare(password, user.password);
				if (doMatch) {
					req.session.user = user;
					req.session.isLoggedIn = true;
					await req.session.save();
					return res.redirect('/');
				}
			} else {
				req.flash('error', 'Invalid email or password.');
				return res.redirect('/login');
			}
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
	postLogout: async (req, res, next) => {
		try {
			req.session.isLoggedIn = false;
			await req.session.destroy();
			return res.redirect('/');
		} catch (e) {
			console.log('Logout error: ', e);
		}
	},
	postResetAccess: async (req, res, next) => {
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
	},
	postResetPage: async (req, res, next) => {
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
					try {
						const msg = createMessage(
							email,
							'Password reset',
							'This is link for resetting your password.',
							user.name,
							`<h4>Please follow the link to reset your password: </h4><a href='http://localhost:3000/reset/${token}'>reset password</a>`
						);
						await sgMail.send(msg);
						console.log('Email was sent.');
						return res.redirect('/');
					} catch (e) {
						console.log('Sending email from SendGrid error: ', e);
					}
				}
			});
		}
	},
	postSignup: async (req, res, next) => {
		try {
			const { email, userName, password, repeated_password } = req.body;
			if (password === repeated_password) {
				const candidate = await User.findOne({ email: email });
				if (candidate) {
					req.flash(
						'errorUserExists',
						`User with this email ${email} already exists.`
					);
					return res.redirect('/signup');
				} else {
					const hashPassword = await bcrypt.hash(password, 12);
					const user = new User({
						cart: { items: [] },
						email,
						name: userName,
						password: hashPassword,
					});
					await user.save();
					try {
						const msg = createMessage(
							email,
							'Account created!',
							'Your account was successfully created',
							userName,
							'Your account on Node pet project platform was successfully created.'
						);
						await sgMail.send(msg);
						console.log('Email was sent.');
					} catch (e) {
						console.log('Sending email from SendGrid error: ', e);
					}
					return res.redirect('/login');
				}
			} else {
				req.flash('errorPassword', 'Passwords do not match.');
				return res.redirect('/signup');
			}
		} catch (e) {
			console.log('Sign up post error: ', e);
		}
	},
};
