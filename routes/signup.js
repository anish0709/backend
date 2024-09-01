const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Correct the model name to 'User'

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, image, phone} = req.body;

        // Validate input
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, email, password and phone are required' });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image,
            phone
        });

        // Save the user to the database
        await newUser.save();

        // Create and sign a JWT token
        const payload = { user: { id: newUser.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Create and sign a JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Return the token
        res.status(200).json({status:200, token, checkData:user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
