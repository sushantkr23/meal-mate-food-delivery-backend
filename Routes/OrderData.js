const express = require('express');
const Order = require('../models/Orders');
const router = express.Router();

// Place order
router.post('/orderData', async (req, res) => {
    let items = req.body.order_data;

    // Correct structure for each order
    let orderEntry = {
        Order_date: req.body.order_date,
        items: items
    };

    try {
        let eId = await Order.findOne({ 'email': req.body.email });
        if (!eId) {
            // New user
            await Order.create({
                email: req.body.email,
                order_data: [orderEntry]
            });
            return res.json({ success: true });
        } else {
            // Existing user
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: orderEntry } }
            );
            return res.json({ success: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get orders
router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email });
        res.json({ orderData: myData ? myData.order_data : [] });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
