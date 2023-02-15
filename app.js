const { doubleCsrf } = require('csrf-csrf');

const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const fs = require('fs');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const { getPageNotFound } = require('./controllers/error');
const { options } = require('./configs/csrf-csrfOptions');

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const errorRouter = require('./routes/errors');
const keys = require('./configs/keys');
const shopRouter = require('./routes/shop');
const User = require('./models/mongoose/user');

const app = express();

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", "https://js.stripe.com/v3/"],
			"script-src": ["'self'", "https://js.stripe.com/v3/"],
			'img-src': ["'self'", 'https://m.media-amazon.com/images/I/'],
		},
	})
);

app.use(compression());

const MongoDBStore = require('connect-mongodb-session')(session);

const { doubleCsrfProtection } = doubleCsrf(options);

app.use(cookieParser(keys.COOKIE_PARSER_SECRET));
const store = new MongoDBStore({
	uri: keys.MONGO_URL_MONGOOSE,
	collection: 'sessions',
});

app.engine(
	'hbs',
	expressHandlebars.engine({
		extname: '.hbs',
		layoutsDir: 'views/layouts',
		defaultLayout: 'main-layout',
		helpers: require('./utils/handlebars-helpers'),
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: 'It is a secret value',
		resave: false,
		saveUninitialized: false,
		store,
	})
);

app.use(async (req, res, next) => {
	try {
		if (req.session.user) {
			const user = await User.findById(req.session.user._id);
			req.user = user;
		}
		next();
	} catch (e) {
		console.log('Storing user in req error: ', e);
	}
});

app.use(doubleCsrfProtection);
app.use(flash());
app.use('/admin', adminRouter);
app.use(authRouter);
app.use(shopRouter);
app.use(errorRouter);
app.use(getPageNotFound);

app.use((error, req, res, next) => {
	res.status(500).render('500', {
		title: 'Error page 500',
		isAuthenticated: req.session.isLoggedIn,
	});
});

const start = async () => {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(keys.MONGO_URL_MONGOOSE);
		console.log('Mongoose successfully connected.');
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
	} catch (e) {
		console.log('Starting app error: ', e);
	}
};

start();
