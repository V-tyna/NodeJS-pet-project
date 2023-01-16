const fs = require('fs');
const path = require('path');
const staticPath = require('../util/path');

const p = path.join(staticPath, 'data', 'products.json');

module.exports = class Product {
	constructor(title) {
		this.title = title;
	}

	async save() {
		const products = await Product.fetchAll();
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
	}

	static fetchAll() {
		return new Promise((res, rej) => {
			fs.readFile(p, (err, fileContent) => {
				if (err) {
					rej([]);
				}
				res(JSON.parse(fileContent));
			});
		});
	}
};
