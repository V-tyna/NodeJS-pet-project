const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const { getPageNotFound } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { client } = require('./utils/mongoDB');

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
// app.use(async (req, res, next) => {
// 	try {
// 		const user = await User.findByPk(1);
// 		req.user = user;
// 		next();
// 	} catch(e) {
// 		console.log('Storing user in req error: ', e);
// 	}
// });

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(getPageNotFound);

const start = async () => {
	try {
		await client.connect();
		console.log('MongoDB connected.');
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
	 } catch(e) {
		console.log('Starting app error: ', e);
	 }
}

start();
