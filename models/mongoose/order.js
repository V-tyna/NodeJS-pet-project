const { model, Schema, SchemaTypes } = require('mongoose');

const orderSchema = new Schema({
	orderData: [
		{
			productId: { type: String, required: true },
			title: { type: String, required: true },
			imageUrl: { type: String, required: true },
			description: { type: String, required: true },
			price: { type: Number, required: true },
			quantity: { type: Number, required: true },
		},
	],
	address: {
		type: String,
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	userId: {
		type: SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
});

module.exports = model('Order', orderSchema);
