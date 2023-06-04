const mongoose = require('mongoose');
const { CartItemSchema } = require("./cartItem.js");

const OrderSchema = new mongoose.Schema({
  orderNumber: Number,
  customerInfo: {
    name: String,
    phoneNumber: String,
    address: String,
    email: String,
  },
  items: [CartItemSchema],
  total: Number
});

module.exports = mongoose.model('Order', OrderSchema);
