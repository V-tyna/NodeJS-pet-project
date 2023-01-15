const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const { adminRouter } = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.engine(
	'hbs',
	expressHandlebars.engine({
		extname: '.hbs',
		layoutsDir: 'views/layouts',
		defaultLayout: 'main-layout',
	})
);
app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
	res.status(404).render('404', {
		pageTitle: 'Page not found',
	});
});

app.listen(3000, () => {
	console.log('Server is running on port: 3000.');
});
