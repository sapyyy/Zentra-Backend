const Package = require("../models/package.schema");

// Create a new travel package
const createPackage = async (req, res) => {
  try {
    const {
      title,
      destination,
      duration,
      price,
      itinerary,
      inclusions,
      exclusions,
      images,
      availability,
    } = req.body;

    // Basic validation
    if (!title || !destination || !price) {
      return res
        .status(400)
        .json({ message: "Title, destination ID, and price are required." });
    }

    const newPackage = new Package({
      title,
      agency: req.user.id, // Extracted securely from the JWT token
      destination, // This should be the _id of an existing destination
      duration,
      price,
      itinerary,
      inclusions,
      exclusions,
      images,
      availability,
    });

    const savedPackage = await newPackage.save();
    return res.status(201).json({
      message: "Package created successfully",
      package: savedPackage,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating package", error: err.message });
  }
};

// Get all packages (with population)
const getAllPackages = async (req, res) => {
  try {
    // .populate() replaces the ID references with the actual document data
    const packages = await Package.find()
      .populate("agency", "firstName lastName email") // Only grab specific fields from the user
      .populate("destination", "name country coordinates");

    return res.status(200).json({ packages });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching packages", error: err.message });
  }
};

// Get a single package by ID
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate("agency", "firstName lastName email")
      .populate("destination");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json({ package: pkg });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching package", error: err.message });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
};
