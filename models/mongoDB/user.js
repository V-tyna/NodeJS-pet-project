const { ObjectId } = require('mongodb');
const deepClone = require('../../utils/deepClone');
const { db } = require('../../utils/mongoDB');

class User {
	constructor(name, email, cart) {
		this.name = name;
		this.email = email;
		this.cart = cart;
	}

	async save() {
		return await db.collection('users').insertOne(this);
	}

	static addToCart(user, product) {
		const cartProductIndex = user.cart.items.findIndex((p) => {
			return p.productId.toString() === product._id.toString();
		});
    const updatedCart = { items: [...user.cart.items] };
		if (cartProductIndex !== -1) {
      updatedCart.items[cartProductIndex].quantity += 1;
    } else {
      updatedCart.items.push({ productId: new ObjectId(product._id), quantity: 1 });
		}
		return db.collection('users').findOneAndUpdate(
			{ _id: user._id },
			{ $set: { cart: updatedCart } }
		);
	}

  static async getCart(userCart) {
    const productIds = userCart.items.map(prod => prod.productId);
    return db.collection('products').find({_id: {
      $in: productIds
    }}).toArray();
  }

  static async deleteProductFromTheCart(id, user) {
    const updatedCart = { items: user.cart.items.filter(item => item.productId.toString() !== id.toString())};
    return db.collection('users').findOneAndUpdate(
			{ _id: user._id },
			{ $set: { cart: updatedCart } }
		);
  }

	static findUserById(id) {
		return db.collection('users').findOne({ _id: new ObjectId(id) });
	}
}

module.exports = User;
