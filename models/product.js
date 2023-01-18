const fs = require('fs');
const path = require('path');
const staticPath = require('../utils/path');
const Cart = require('./cart');

const pathToProducts = path.join(staticPath, 'data', 'products.json');

module.exports = class Product {
	constructor(title, imageUrl, price, description, id) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
		this.id = id;
	}

	async save() {
		const products = await Product.fetchAll();
		if (this.id) {
			const exitingProductIndex = products.findIndex(p => p.id === this.id);
			const updatedProducts = [...products];
			const oldPrice = +updatedProducts[exitingProductIndex].price;
			const updatedPrice = +this.price;
			if (oldPrice !== updatedPrice) {
				const difference = oldPrice - updatedPrice;
				await Cart.updatePrice(this.id, difference);
			}
			updatedProducts[exitingProductIndex] = this;
			fs.writeFile(pathToProducts, JSON.stringify(updatedProducts), (err) => {
				console.log(err);
			});
		} else {
			this.id = Math.floor(Math.random() * Date.now()).toString();
			products.push(this);
			fs.writeFile(pathToProducts, JSON.stringify(products), (err) => {
				console.log(err);
			});
		}
	}

	static async deleteById(id, price) {
		const products = await Product.fetchAll();
		const updatedProducts = products.filter(p => p.id !== id);
		fs.writeFile(pathToProducts, JSON.stringify(updatedProducts), (err) => {
			console.log(err);
		});
		await Cart.deleteProduct(id, price);
	}

	static fetchAll() {
		return new Promise((res, rej) => {
			fs.readFile(pathToProducts, (err, fileContent) => {
				if (err) {
					rej([]);
				}
				res(JSON.parse(fileContent));
			});
		});
	}

	static findProductById(id) {
		return new Promise(async (res, rej) => {
			const products = await Product.fetchAll();
			const product =  products.find(prod => prod.id === id);
			if (product) {
				res(product);
			} else {
				rej('Product not found');
			}
		})
	}
};