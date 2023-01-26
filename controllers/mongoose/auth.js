const User = require('../../models/mongoose/user');

module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			res.render('admin/login', {
				isAuthenticated: req.session.isLoggedIn,
				formCSS: true,
				pageTitle: 'Login',
			});
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
	postLoginPage: async (req, res, next) => {
		try {
			const user = await User.findById('63d003d6e348acd4df5df96e');
			req.session.isLoggedIn = true;
			req.session.user = user;
			await req.session.save();
			// console.log('USER: ', req.user);
			res.redirect('/');
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
	postLogout: async (req, res, next) => {
		try {
			await req.session.destroy();
			return res.redirect('/');
		} catch(e) {
			console.log('Logout error: ', e);
		}
	}
};
