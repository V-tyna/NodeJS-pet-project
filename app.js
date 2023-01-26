const cookieParser = require('cookie-parser');
const { doubleCsrf } = require("csrf-csrf");
const { doubleCsrfProtection } = doubleCsrf({
	getSecret: () => 'Secret for csrf-csrf',
	cookieName: 'csrf',
	getTokenFromRequest: req => {
    if (req.body.csrfToken) { 
      return req.body.csrfToken;
    }
    return req['x-csrf-token'];
}
});
const express = require('express');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { MONGO_URL_MONGOOSE } = require('./configs/keys.dev');
const { getPageNotFound } = require('./controllers/error');
const User = require('./models/mongoose/user');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const shopRouter = require('./routes/shop');

const app = express();
app.use(cookieParser());
const store = new MongoDBStore({
	uri:  MONGO_URL_MONGOOSE,
	collection: 'sessions'
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

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'It is a secret value',
	resave: false,
	saveUninitialized: false,
	store
}));

app.use(async (req, res, next) => {
	try {
		if (req.session.user) {
			const user = await User.findById(req.session.user._id);
			req.user = user;
		}
		next();
	} catch(e) {
		console.log('Storing user in req error: ', e);
	}
});

// app.use(globalVariables);
app.use(doubleCsrfProtection);
app.use('/admin', adminRouter);
app.use(authRouter);
app.use(shopRouter);

app.use(getPageNotFound);

const start = async () => {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(MONGO_URL_MONGOOSE);
		console.log('Mongoose successfully connected.');
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
	 } catch(e) {
		console.log('Starting app error: ', e);
	 }
}

start();
