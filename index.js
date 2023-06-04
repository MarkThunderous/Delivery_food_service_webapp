const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
const Order = require('./models/order');
const Coupon = require('./models/coupon');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully!'))
.catch(err => console.error(err));

const Shop = require('./models/shop');
const CartItem = require('./models/cartItem');

app.get('/', function(req, res) {
    res.redirect("/shops");
});

app.get('/shops', function(req, res) {
    res.sendFile(__dirname + '/public/shops.html');
});

app.get('/cart', function(req, res) {
    res.sendFile(__dirname + '/public/cart.html');
});

app.get('/api/shops', async (req, res) => {
    const shops = await Shop.find();
    res.json(shops);
});

app.get('/api/cart', async (req, res) => {
    const cartItems = await CartItem.find();
    res.json(cartItems);
});
app.post('/api/cart', async (req, res) => {
    const newCartItem = new CartItem(req.body);
    const savedCartItem = await newCartItem.save();

    if (savedCartItem) {
        res.json(savedCartItem);
    } else {
        res.status(500).json({ error: 'Failed to save cart item' });
    }
});
app.put('/cart/:id', async (req, res) => {
    const updatedCartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCartItem);
});

app.delete('/api/cart', async (req, res) => {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared' });
});
app.delete('/cart/:id', async (req, res) => {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
});

app.post('/api/order', async (req, res) => {
  try {
    const { customerInfo, items, total } = req.body;

    // Create a new order
    const newOrder = new Order({
      customerInfo,
      items,
      total
    });

    // Generate order number
    newOrder.orderNumber = Math.floor(Math.random() * 1000000);

    // Save the order to the database
    await newOrder.save();

    // Respond with the saved order
    res.json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/order-history', async (req, res) => {
  const { email, phoneNumber, orderNumber } = req.body;
let query = {
  $or: [
    { 'customerInfo.email': email },
    { 'customerInfo.phoneNumber': phoneNumber },
    { orderNumber: orderNumber }
  ]
};

  try {
    const orders = await Order.find(query).select('-__v');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { email, phone, orderId } = req.body;

        const orderNumber = orderId ? parseInt(orderId) : null;

        let query = {};

        if (email) {
            query['customerInfo.email'] = email;
        }

        if (phone) {
            query['customerInfo.phoneNumber'] = phone;
        }

        if (orderNumber) {
            query['orderNumber'] = orderNumber;
        }

        const orders = await Order.find(query);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/coupons', async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/validate-coupon', async (req, res) => {
    console.log('POST /api/validate-coupon', req.body);  // Log the request

    const { code } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code });
        if (!coupon) {
            res.status(404).json({ message: 'Coupon not found' });
        } else if (coupon.expirationDate < Date.now()) {
            res.status(400).json({ message: 'Coupon has expired' });
        } else {
            res.json(coupon);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
