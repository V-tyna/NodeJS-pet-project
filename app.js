const express = require('express');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const { MONGO_URL_MONGOOSE } = require('./configs/keys.dev');

const { getPageNotFound } = require('./controllers/error');
const User = require('./models/mongoose/user');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

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

app.use(async (req, res, next) => {
	try {
		const user = await User.findById('63d003d6e348acd4df5df96e');
		req.user = user;
		// console.log('USER: ', req.user);
		next();
	} catch(e) {
		console.log('Storing user in req error: ', e);
	}
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(getPageNotFound);

const start = async () => {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(MONGO_URL_MONGOOSE);
		console.log('Mongoose successfully connected.');
		const candidate = User.findById('63d003d6e348acd4df5df96e');
		if (!candidate) {
			const user = new User({
				name: 'Valya',
				email: 'v-tyna@gmail.com',
				cart: { items: [] }
			});
			user.save();
		}
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
	 } catch(e) {
		console.log('Starting app error: ', e);
	 }
}

start();
