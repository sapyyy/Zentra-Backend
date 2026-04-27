const Booking = require("../models/booking.model");
const Package = require("../models/package.schema");
const Hotel = require("../models/hotel.model");
const Transport = require("../models/transport.model");

// Universal Booking Controller
const createBooking = async (req, res) => {
  try {
    const { itemType, itemId, guests, totalAmount, travelDates } = req.body;

    // 1. Basic validation
    if (!itemType || !itemId || !guests || !totalAmount) {
      return res
        .status(400)
        .json({
          message: "itemType, itemId, guests, and totalAmount are required.",
        });
    }

    // 2. Verify the item actually exists before booking
    let itemExists = false;
    if (itemType === "Package") itemExists = await Package.findById(itemId);
    if (itemType === "Hotel") itemExists = await Hotel.findById(itemId);
    if (itemType === "Transport") itemExists = await Transport.findById(itemId);

    if (!itemExists) {
      return res
        .status(404)
        .json({ message: `${itemType} not found in our database.` });
    }

    // 3. Create the booking document
    const newBooking = new Booking({
      user: req.user.id, // Extracted securely from the JWT token
      itemType,
      itemId,
      travelDates,
      guests,
      totalAmount,
      paymentStatus: "pending", // Defaulting to pending until a payment gateway is integrated
      bookingStatus: "confirmed",
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      message: "Booking successful!",
      booking: savedBooking,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error processing booking", error: err.message });
  }
};

// Get all bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    // Fetch bookings only for the person making the request
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "itemId",
    ); // Because of refPath, Mongoose magically populates the right schema!

    return res.status(200).json({ bookings });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching bookings", error: err.message });
  }
};

module.exports = { createBooking, getUserBookings };
