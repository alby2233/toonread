const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// Create Order for buying coins
router.post('/create-order', verifyToken, async (req, res) => {
  const { amount, coins } = req.body; // amount is in paise (e.g., 500 for ₹5.00)
  const userId = req.user.id;

  try {
    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `receipt_order_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        coinsAdded: coins
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({ id: order.id, amount: order.amount, currency: order.currency, coinsAdded: coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment Signature
router.post('/verify-payment', verifyToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coinsAdded, amount } = req.body;
  const userId = req.user.id;

  try {
    // Check if we have the actual secret key for verification
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      
      // Check if this transaction was already processed
      db.get("SELECT * FROM transactions WHERE stripeSessionId = ?", [razorpay_payment_id], (err, row) => {
        if (row) return res.json({ success: true, message: 'Already processed' });

        // Add transaction and update user coins
        db.run("INSERT INTO transactions (userId, stripeSessionId, amount, coinsAdded, date) VALUES (?, ?, ?, ?, ?)",
          [userId, razorpay_payment_id, amount, coinsAdded, new Date().toISOString()], 
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to record transaction' });

            db.run("UPDATE users SET coins = coins + ? WHERE id = ?", [coinsAdded, userId], (err) => {
               if (err) return res.status(500).json({ error: 'Failed to add coins' });
               res.json({ success: true, coinsAdded: coinsAdded });
            });
        });
      });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
