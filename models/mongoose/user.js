const { model, Schema, SchemaTypes } = require('mongoose');

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: { type: SchemaTypes.ObjectId, ref: 'Product', required: true },
				quantity: { type: Number, required: true },
			},
		],
	},
});

userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex((p) => {
		return p.productId.toString() === product._id.toString();
	});
	const updatedCart = { items: [...this.cart.items] };
	if (cartProductIndex !== -1) {
		updatedCart.items[cartProductIndex].quantity += 1;
	} else {
		updatedCart.items.push({
			productId: product._id,
			quantity: 1,
		});
	}
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.deleteProductFromTheCart = function(id) {
	const updatedCart = {
		items: this.cart.items.filter(
			(item) => item.productId.toString() !== id.toString()
		)
	};
	this.cart = updatedCart;
	return this.save();
}

userSchema.methods.cleanCart = function(id) {
	const updatedCart = { items: [] };
	this.cart = updatedCart;
	return this.save();
}

module.exports = model('User', userSchema);
