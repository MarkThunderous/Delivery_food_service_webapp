const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
});

const ShopSchema = new mongoose.Schema({
  name: String,
  address: String,
  imageUrl: String,
  products: [ProductSchema],
});

module.exports = mongoose.model('Shop', ShopSchema);
module.exports.ProductSchema = ProductSchema;
