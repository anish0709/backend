const express = require('express');
const router = express.Router();
const orderModel = require("../models/order_model");
const JWT = require('jsonwebtoken');

// Middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Get all orders
router.get("/getAllOrders", verifyToken, async (req, res) => {
    try {
        const orders = await orderModel.find();
        if (!orders.length) return res.status(404).json({ error: 'No orders found' });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders of a particular user
router.get("/getMyOrders/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await orderModel.find({ user: userId }); 
        if (!orders.length) return res.status(404).json({ error: 'No orders found for this user' });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by orderId
router.get("/getOrder/:orderId", verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New order
router.post("/newOrder", async (req, res) => {
    try {
        const { shippingInfo, orderItems, subtotal, shippingCharges, total, user } = req.body;

        if (!shippingInfo || !orderItems || !subtotal || !shippingCharges || !total || !user) { 
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newOrder = new orderModel({
            shippingInfo, orderItems, subtotal, shippingCharges, total, user
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete order by orderId
router.delete("/deleteOrder/:orderId", verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await orderModel.findByIdAndDelete(orderId);
        if (!deletedOrder) return res.status(400).json({ error: 'Order not found' });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status by orderId
router.patch("/updateOrderStatus/:orderId", verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ error: 'Status is required' });

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
