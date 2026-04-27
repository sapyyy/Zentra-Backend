const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  createBooking,
  getUserBookings,
} = require("../controllers/booking.controller");

const router = express.Router();

// Protected: Only logged-in users can view their bookings or create new ones
router.get("/my-bookings", validateToken, getUserBookings);
router.post("/", validateToken, createBooking);

module.exports = router;
