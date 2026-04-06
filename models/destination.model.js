const { model, Schema } = require("mongoose");

// creating destination schema for the destination listing and management
const DestinationSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  country: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  bestTimeToVisit: { type: String },
  coordinates: {
    lat: { type: Number },
    long: { type: Number },
  },
  tags: [{ type: String }],
});

const Destination = model("Destination", DestinationSchema);
module.exports = Destination;
