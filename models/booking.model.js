const { Schema, model } = require("mongoose");

// unified schema for booking package hotel and transport
const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemType: {
    type: String,
    enum: ["Package", "Hotel", "Transport"],
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "itemType", // dynamic reference which we can populate
  },
  bookingDate: { type: Date, default: Date.now },
  travelDates: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
});

const Booking = model("Booking", BookingSchema);
module.exports = Booking;
