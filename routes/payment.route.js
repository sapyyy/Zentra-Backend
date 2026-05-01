const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  createCheckoutSession,
  verifyPayment,
} = require("../controllers/payment.controller");

const router = express.Router();

// Route 1: Initiate the checkout (creates the pending booking and Razorpay order)
router.post("/checkout", validateToken, createCheckoutSession);

// Route 2: Verify the signature after the user "pays" on the frontend
router.post("/verify", validateToken, verifyPayment);

module.exports = router;
