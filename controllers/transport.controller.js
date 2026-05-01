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
      return res.status(400).json({
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
    return res.status(201).json({
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
    const { origin, destination, type, maxPrice, minPrice } = req.query;
    let query = {};

    // 1. Search by Origin and/or Destination
    if (origin) query.origin = { $regex: origin, $options: "i" };
    if (destination) query.destination = { $regex: destination, $options: "i" };

    // 2. Filter by exact Type (flight, train, bus, cab)
    if (type) query.type = type.toLowerCase();

    // 3. Filter by Price Range
    if (maxPrice || minPrice) {
      query.price = {};
      if (maxPrice) query.price.$lte = Number(maxPrice);
      if (minPrice) query.price.$gte = Number(minPrice);
    }

    const transports = await Transport.find(query).populate(
      "owner",
      "firstName lastName email",
    );

    return res.status(200).json({ transports });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching transports", error: err.message });
  }
};

// Update a Transport (Only by the owning Transport-Owner)
const updateTransport = async (req, res) => {
  try {
    const transportId = req.params.id;

    // 1. Find the transport listing
    const existingTransport = await Transport.findById(transportId);
    if (!existingTransport) {
      return res.status(404).json({ message: "Transport not found." });
    }

    // 2. AUTHORIZATION CHECK: Does this owner own this transport listing?
    if (existingTransport.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only edit your own transport listings.",
      });
    }

    // 3. Save the updates (Since transport is mostly flat text data, we can directly pass req.body)
    const updatedTransport = await Transport.findByIdAndUpdate(
      transportId,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Transport updated successfully",
      transport: updatedTransport,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating transport", error: err.message });
  }
};

// Delete a Transport (Only by the owning Transport-Owner)
const deleteTransport = async (req, res) => {
  try {
    const transportId = req.params.id;

    // 1. Find the transport listing
    const existingTransport = await Transport.findById(transportId);
    if (!existingTransport) {
      return res.status(404).json({ message: "Transport not found." });
    }

    // 2. AUTHORIZATION CHECK
    if (existingTransport.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "Unauthorized. You can only delete your own transport listings.",
      });
    }

    // 3. Delete the transport from the database
    await Transport.findByIdAndDelete(transportId);

    return res.status(200).json({ message: "Transport deleted successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting transport", error: err.message });
  }
};

module.exports = {
  createTransport,
  getAllTransports,
  updateTransport,
  deleteTransport,
};
