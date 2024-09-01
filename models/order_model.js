const mongoose = require("mongoose");
const {Schema} = mongoose;

const orderSchema = new Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
    subtotal: {
        type: Number,
        required: true
    },
    shippingCharges:{
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
    },
    orderItems: [
        {
            title: String,
            price: Number,
            quantity: Number,
            image: String,
            stock: Number,
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "productModel"
            }
        }
    ]
}
})

const orderModel = mongoose.model("orderModel", orderSchema);

module.exports = orderModel;
