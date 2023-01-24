const { ObjectId } = require('mongodb');

const { db } = require('../../utils/mongoDB');

class User {
	constructor(name, email, cart) {
		this.name = name;
		this.email = email;
		this.cart = cart;
	}

	save() {
		return db.collection('users').insertOne(this);
	}

	static async addOrder(user, address) {
		const cartProducts = await User.getCart(user);
		const totalPrice = cartProducts.reduce((acc, product) => acc += (product.price * product.quantity), 0).toFixed(2);
		await db.collection('orders').insertOne({
			order: cartProducts,
			address,
			totalPrice,
			userId: user._id,
			createdAt: new Date()
		});
		return db
			.collection('users')
			.findOneAndUpdate(
				{ _id: user._id },
				{ $set: { cart: { items: [] } } }
			);
	}

	static addToCart(user, product) {
		const cartProductIndex = user.cart.items.findIndex((p) => {
			return p.productId.toString() === product._id.toString();
		});
		const updatedCart = { items: [...user.cart.items] };
		if (cartProductIndex !== -1) {
			updatedCart.items[cartProductIndex].quantity += 1;
		} else {
			updatedCart.items.push({
				productId: new ObjectId(product._id),
				quantity: 1,
			});
		}
		return db
			.collection('users')
			.findOneAndUpdate(
				{ _id: user._id },
				{ $set: { cart: updatedCart } }
			);
	}

	static getOrders(id) {
		return db.collection('orders').find({ userId: id }).toArray();
	}

	static async getCart(user) {
		const productIds = user.cart.items.map((prod) => prod.productId);
		const cart = await db
			.collection('products')
			.find({
				_id: {
					$in: productIds,
				},
			})
			.toArray();
			return cart.map((el) => {
				return {
					...el,
					quantity: user.cart.items.find((item) => {
						return item.productId.toString() === el._id.toString();
					}).quantity,
				};
			});
	}

	static deleteProductFromTheCart(id, user) {
		const updatedCart = {
			items: user.cart.items.filter(
				(item) => item.productId.toString() !== id.toString()
			),
		};
		return db
			.collection('users')
			.findOneAndUpdate(
				{ _id: user._id },
				{ $set: { cart: updatedCart } }
			);
	}

	static findUserById(id) {
		return db.collection('users').findOne({ _id: new ObjectId(id) });
	}
}

module.exports = User;
