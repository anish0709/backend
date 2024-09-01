const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    desc: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 1
    },
    fastDelivery: { 
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    sortOrder: { 
        type: Number,
        default: 0
    },
    reviews: [
        {
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            comment: {  
                type: String,
                default: "nice product"
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
