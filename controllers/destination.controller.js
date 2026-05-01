const Destination = require("../models/destination.model");

const createDestination = async (req, res) => {
  try {
    const { name, country, description, bestTimeToVisit, tags } = req.body;

    if (!name || !country || !description) {
      return res
        .status(400)
        .json({ message: "Name, country, and description are required." });
    }

    // Since coordinates is an object, form-data sends it as a stringified JSON.
    // We need to parse it back into an object.
    let parsedCoordinates = {};
    if (req.body.coordinates) {
      parsedCoordinates = JSON.parse(req.body.coordinates);
    }

    // Extract the Cloudinary secure URLs from the req.files array
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path); // 'path' contains the Cloudinary URL
    }

    const newDestination = new Destination({
      name,
      country,
      description,
      images: imageUrls, // Save the array of Cloudinary URLs to MongoDB
      bestTimeToVisit,
      coordinates: parsedCoordinates,
      tags: req.body.tags ? req.body.tags.split(",") : [], // If passing tags as comma-separated string
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
    const { search, tag } = req.query;
    let query = {};

    // 1. Search by Name (Case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 2. Filter by Tag (Checks if the array contains the tag)
    if (tag) {
      query.tags = { $in: [new RegExp(tag, "i")] };
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
