const Transport = require("../models/transport.model");

const createTransport = async (req, res) => {
  try {
    const {
      type,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      seatsAvailable,
    } = req.body;

    if (!type || !origin || !destination || !price) {
      return res
        .status(400)
        .json({
          message: "Type, origin, destination, and price are required.",
        });
    }

    const newTransport = new Transport({
      owner: req.user.id, // Forced from JWT
      type,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      seatsAvailable,
    });

    const savedTransport = await newTransport.save();
    return res
      .status(201)
      .json({
        message: "Transport added successfully",
        transport: savedTransport,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error adding transport", error: err.message });
  }
};

const getAllTransports = async (req, res) => {
  try {
    // Basic search filtering (e.g., ?origin=Delhi&destination=Agra)
    const { origin, destination, type } = req.query;
    let query = {};
    if (origin) query.origin = { $regex: origin, $options: "i" };
    if (destination) query.destination = { $regex: destination, $options: "i" };
    if (type) query.type = type;

    const transports = await Transport.find(query).populate(
      "owner",
      "firstName lastName",
    );
    return res.status(200).json({ transports });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching transport", error: err.message });
  }
};

module.exports = { createTransport, getAllTransports };
