const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const { getPageNotFound } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const sequelize = require('./utils/sequelize');
const Product = require('./models/sequelize/product');
const User = require('./models/sequelize/user');
const Cart = require('./models/sequelize/cart');
const CartItem = require('./models/sequelize/cart-item');
const Order = require('./models/sequelize/order');
const OrderItem = require('./models/sequelize/order-item');

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

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(1);
		req.user = user;
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
		User.hasMany(Product);
		Product.belongsTo(User, {
			constraints: true,
			onDelete: 'CASCADE'
		});

		User.hasOne(Cart);
		Cart.belongsTo(User);

		Cart.belongsToMany(Product, { through: CartItem });
		Product.belongsToMany(Cart, { through: CartItem });

		Order.belongsTo(User);
		User.hasMany(Order);

		Order.belongsToMany(Product, { through: OrderItem });

		// await sequelize.sync({ force: true });
		await sequelize.sync();
		console.log('All models were synchronized successfully.');
		const user = await User.findByPk(1);
		if (!user) {
			const user = await User.create({ name: 'Valya', email: 'v-tyna@gmail.com' });
			user.createCart();
		}
		app.listen(3000, () => {
			console.log('Server is running on port: 3000.');
		});
	} catch(e) {
		console.error('Start app error: ', e);
	}
}

start();
