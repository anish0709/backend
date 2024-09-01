const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);