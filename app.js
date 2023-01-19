const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const { getPageNotFound } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const sequelize = require('./utils/sequelize');
const Product = require('./models/productSequelize');

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
// app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(getPageNotFound);

const start = async () => {
	try {
		await sequelize.sync();
		console.log('All models were synchronized successfully.');
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
		
	} catch(e) {
		console.error('Start app error: ', e);
	}
}

start();
