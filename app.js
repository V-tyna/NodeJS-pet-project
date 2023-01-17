const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const { getPageNotFound } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.engine(
	'hbs',
	expressHandlebars.engine({
		extname: '.hbs',
		layoutsDir: 'views/layouts',
		defaultLayout: 'main-layout',
		helpers: require('./util/handlebars-helpers'),
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

app.listen(3000, () => {
	console.log('Server is running on port: 3000.');
});
