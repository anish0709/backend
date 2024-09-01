const mongoose = require('mongoose');
const Product = require('./product_model'); // Adjust the path as needed

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional for non-logged-in users
    },
    sessionId: {
        type: String,
        required: false, // Optional for logged-in users
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Ensure this matches the model name registered above
                required: true,
            },
            title: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            image: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
