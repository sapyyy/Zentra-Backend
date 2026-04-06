const { Schema, model } = require("mongoose");

// creating a schema for storing the details for the hotels
const HotelSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: "Destination",
  },
  address: {
    type: String,
    required: true,
  },
  // eg: ['Pool', 'Parking', 'AC']
  features: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  roomTypes: [
    {
      type: { type: String }, // e.g. 'Deluxe', 'Suite'
      pricePerNight: { type: Number },
      capacity: { type: Number },
      availableRooms: { type: Number },
    },
  ],
});

const Hotel = model("Hotel", HotelSchema);
module.exports = Hotel;
