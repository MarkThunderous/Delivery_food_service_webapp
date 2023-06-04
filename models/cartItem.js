const mongoose = require('mongoose');
const { ProductSchema } = require("./shop.js");

const CartItemSchema = new mongoose.Schema({
  product: ProductSchema,
  count: Number,
});

module.exports = mongoose.model('CartItem', CartItemSchema);
module.exports.CartItemSchema = CartItemSchema;
