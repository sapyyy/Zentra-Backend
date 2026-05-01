const Razorpay = require("razorpay");
const crypto = require("crypto");
// Import your database models here (e.g., Booking, Package, Hotel)
const Booking = require("../models/booking.model");

// 1. Initialize Razorpay using your secure .env keys
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Create the Order
const createCheckoutSession = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;

    // SECURITY BEST PRACTICE:
    // Always fetch the price from your database using the itemId.
    // Do NOT trust the frontend to send the price.
    // Example: const item = await Package.findById(itemId);
    // const unitPrice = item.price;
    const unitPrice = 5000; // Hardcoded for this example, replace with DB call

    const totalAmount = unitPrice * quantity;

    // Create a "Pending" booking in your database
    const newBooking = new Booking({
      user: req.user.id,
      itemId: itemId,
      totalAmount: totalAmount,
      paymentStatus: "Pending",
    });
    const savedBooking = await newBooking.save();

    // Ask Razorpay to create an order for this amount
    const options = {
      amount: totalAmount * 100, // Razorpay strictly requires paise (amount * 100)
      currency: "INR",
      receipt: `receipt_${savedBooking._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Send the Order ID back to the frontend to launch the checkout window
    return res.status(200).json({
      orderId: order.id,
      bookingId: savedBooking._id,
      amount: order.amount,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Checkout failed", error: err.message });
  }
};

// 3. Verify the Payment Signature
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Cryptographically verify the signature to prevent fraud
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Failed" });
      return res.status(400).json({ message: "Payment verification failed." });
    }

    // Success! Update the booking status to "Paid"
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "Paid",
      transactionId: razorpay_payment_id,
    });

    return res
      .status(200)
      .json({ message: "Payment successful! Booking confirmed." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error verifying payment", error: err.message });
  }
};

module.exports = { createCheckoutSession, verifyPayment };
