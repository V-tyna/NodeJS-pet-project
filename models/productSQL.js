const db = require('../utils/databaseSQL');
const Cart = require('./cart');

module.exports = class ProductDB {
	constructor(title, imageUrl, price, description, id) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
		this.id = id;
	}

	save() {
		return db.execute(
			'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
			[this.title, this.price, this.description, this.imageUrl]
		);
	}

	static deleteById(id, price) {}

	static fetchAll() {
		return db.execute('SELECT * FROM products');
	}

	static findProductById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
