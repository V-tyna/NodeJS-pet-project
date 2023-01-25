module.exports = {
	getLoginPage: (req, res, next) => {
		try {
			const isLoggedIn = req.session.isLoggedIn;
			res.render('admin/login', {
				isAuthenticated: isLoggedIn,
				formCSS: true,
				pageTitle: 'Login',
			});
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
	postLoginPage: (req, res, next) => {
		try {
			req.session.isLoggedIn = true;
			res.redirect('/');
		} catch (e) {
			console.log('Login page rendering error: ', e);
		}
	},
};
