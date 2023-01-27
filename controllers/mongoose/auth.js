const bcrypt = require('bcryptjs');

const User = require('../../models/mongoose/user');

module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			return res.render('admin/login', {
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
			return res.render('admin/signup', {
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
			console.log('USER DATA: ', email, userName, password);
			if (password === repeated_password) {
				const candidate = await User.findOne({ email: email });
				if (candidate) {
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
			}
		} catch (e) {
			console.log('Sign up post error: ', e);
		}
	},
};
