const Destination = require("../models/destination.model");

// Create a new destination
const createDestination = async (req, res) => {
  try {
    const {
      name,
      country,
      description,
      images,
      bestTimeToVisit,
      coordinates,
      tags,
    } = req.body;

    // Basic validation
    if (!name || !country || !description) {
      return res
        .status(400)
        .json({ message: "Name, country, and description are required." });
    }

    const newDestination = new Destination({
      name,
      country,
      description,
      images,
      bestTimeToVisit,
      coordinates,
      tags,
    });

    const savedDestination = await newDestination.save();
    return res.status(201).json({
      message: "Destination created successfully",
      destination: savedDestination,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating destination", error: err.message });
  }
};

// Get all destinations (with Search & Filter built-in)
const getAllDestinations = async (req, res) => {
  try {
    const { search, country } = req.query;
    let query = {};

    // If the user searches for "Pari", it will find "Paris" (Case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    // If the user filters by a specific country
    if (country) {
      query.country = { $regex: country, $options: "i" };
    }

    const destinations = await Destination.find(query);
    return res.status(200).json({ destinations });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching destinations", error: err.message });
  }
};

// Get a single destination by ID
const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    return res.status(200).json({ destination });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching destination", error: err.message });
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
};
