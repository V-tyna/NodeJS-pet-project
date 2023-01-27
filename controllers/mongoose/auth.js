const bcrypt = require('bcryptjs');

const { createToken } = require('../../utils/createToken');

const User = require('../../models/mongoose/user');

module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			createToken(res);
			return res.render('admin/login', {
				errorMessage: req.flash('error'),
				isAuthenticated: req.session.isLoggedIn,
				formCSS: true,
				pageTitle: 'Login Page',
			});
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
	getSignupPage: (req, res, next) => {
		try {
			createToken(res);
			return res.render('admin/signup', {
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
					req.session.isLoggedIn = true;
					req.session.user = user;
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
			await req.session.destroy();
			return res.redirect('/');
		} catch (e) {
			console.log('Logout error: ', e);
		}
	},
	postSignup: async (req, res, next) => {
		try {
			const { email, userName, password, repeated_password } = req.body;
			if (password === repeated_password) {
				const candidate = await User.findOne({ email: email });
				if (candidate) {
					req.flash('errorUserExists', `User with this email ${email} already exists.`);
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
