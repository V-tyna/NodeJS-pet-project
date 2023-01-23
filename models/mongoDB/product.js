const { ObjectId } = require('mongodb');

const { db } = require('../../utils/mongoDB');

class Product {
  constructor(title, imageUrl, price, description) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
	}

  async save() {
    return await db.collection('products').insertOne(this);
  }

  static async fetchAll() {
    return await db.collection('products').find().toArray();
  }

  static async findProductById(id) {
    return await db.collection('products').findOne({ _id: new ObjectId(id) });
  }

  static async deleteProduct(id) {
    return await db.collection('products').findOneAndDelete({ _id: new ObjectId(id) });
  }

  static async updateProduct(id, obj) {
    return await db.collection('products').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: obj});
  }
}

module.exports = Product;
