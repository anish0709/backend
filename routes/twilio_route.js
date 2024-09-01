const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const OtpModel = require('../models/otp_model');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

router.post('/sendOtp', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OtpModel.create({ phoneNumber, otp });

        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verifyOtp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const validOtp = await OtpModel.findOne({ phoneNumber, otp });

        if (validOtp) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
