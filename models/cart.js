const fs = require('fs');
const path = require('path');
const staticPath = require('../util/path');

const pathToCart = path.join(staticPath, 'data', 'cart.json');

module.exports = class Cart {

  static async addProduct(id, productPrice) {
      const cart = await Cart.fetchAll();
      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct = {};
      if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.quantity += 1; 
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = (+cart.totalPrice + +productPrice).toFixed(2);
      fs.writeFile(pathToCart, JSON.stringify(cart), (err) => {
        console.log('Writing file error: ', err);
      });
  }

  static async deleteProduct(id, price) {
    const cart = await Cart.fetchAll();
    const product = cart.products.find(p => p.id === id);
    if (product) {
      const priceToSubtract = +price * product.quantity;
      const updatedProds = cart.products.filter(p => p.id !== id);
      const updatedPrice = +cart.totalPrice - priceToSubtract;
      const updatedCart = { products: updatedProds, totalPrice: updatedPrice };
      fs.writeFile(pathToCart, JSON.stringify(updatedCart), (err) => {
        console.log('Deleting writing file error: ', err);
      });
    }
  }

  static async updatePrice(id, difference) {
    const cart = await Cart.fetchAll();
    const productQuantity = cart.products.find(p => p.id ===id).quantity;
    const updatedPrice = cart.totalPrice - difference.toFixed(2) * +productQuantity;
    const updatedCart = { products: [ ...cart.products ], totalPrice: updatedPrice };
    fs.writeFile(pathToCart, JSON.stringify(updatedCart), (err) => {
      console.log('Updating Price writing file error: ', err);
    });
  }

  static fetchAll() {
    return new Promise((res, rej) => {
      fs.readFile(pathToCart, (err, fileContent) => {
				if (err) {
          res({ products: [], totalPrice: 0 });
				} else {
          res(JSON.parse(fileContent));
        }
			});
    });
  }
};
