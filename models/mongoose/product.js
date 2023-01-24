const { Schema, model, SchemaTypes } = require('mongoose');

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Product', productSchema);
