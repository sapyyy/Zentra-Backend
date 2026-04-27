const { Schema, model } = require("mongoose");

// transport schema for the transports ['bus', 'cab', 'flight', 'train']
const TransportSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["bus", "cab", "flight", "train"],
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsAvailable: {
    type: Number,
  },
});

const Transport = model("Transport", TransportSchema);
module.exports = Transport;
