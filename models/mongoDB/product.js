const { ObjectId } = require('mongodb');

const { db } = require('../../utils/mongoDB');
const User = require('./user');

class Product {
  constructor(title, imageUrl, price, description, userId) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
    this.userId = userId;
	}

  save() {
    return db.collection('products').insertOne(this);
  }

  static fetchAll() {
    return db.collection('products').find().toArray();
  }

  static findProductById(id) {
    return db.collection('products').findOne({ _id: new ObjectId(id) });
  }

  static async deleteProduct(id, user) {
    await User.deleteProductFromTheCart(id, user);
    return db.collection('products').findOneAndDelete({ _id: new ObjectId(id) });
  }

  static updateProduct(id, obj) {
    return db.collection('products').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: obj});
  }
}

module.exports = Product;
