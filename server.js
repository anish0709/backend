require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const signupRouter = require('./routes/signup');
const productRouter = require('./routes/product_route');
const orderRouter = require("./routes/order_route");
const twilioRouter = require('./routes/twilio_route');
const cartRouter = require('./routes/cart_route');
const app = express();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api', signupRouter);
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use('/twilio', twilioRouter); 
app.use('/api', cartRouter)
// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('MONGO_URI is not defined. Please set it in your .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
