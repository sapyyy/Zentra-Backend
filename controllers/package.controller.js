const Package = require("../models/package.schema");

// Create a new travel package
const createPackage = async (req, res) => {
  try {
    const { title, price, availability, destination } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required." });
    }

    // 1. Parse the complex form-data strings back into Objects/Arrays
    let parsedDuration = {};
    if (req.body.duration) parsedDuration = JSON.parse(req.body.duration);

    let parsedItinerary = [];
    if (req.body.itinerary) parsedItinerary = JSON.parse(req.body.itinerary);

    let parsedInclusions = [];
    if (req.body.inclusions) parsedInclusions = JSON.parse(req.body.inclusions);

    let parsedExclusions = [];
    if (req.body.exclusions) parsedExclusions = JSON.parse(req.body.exclusions);

    // 2. Extract Cloudinary URLs from the files uploaded by Multer
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    // 3. Create the document, forcing the agency to be the logged-in user
    const newPackage = new Package({
      agency: req.user.id,
      destination,
      title,
      price,
      duration: parsedDuration,
      itinerary: parsedItinerary,
      inclusions: parsedInclusions,
      exclusions: parsedExclusions,
      images: imageUrls,
      availability,
    });

    const savedPackage = await newPackage.save();
    return res
      .status(201)
      .json({ message: "Package created successfully", package: savedPackage });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating package", error: err.message });
  }
};

// Get all packages (with population)
const getAllPackages = async (req, res) => {
  try {
    const { search, maxPrice, minPrice, destinationId } = req.query;
    let query = {};

    // 1. Search by Package Title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 2. Filter by Price Range
    if (maxPrice || minPrice) {
      query.price = {};
      if (maxPrice) query.price.$lte = Number(maxPrice); // Less than or equal to
      if (minPrice) query.price.$gte = Number(minPrice); // Greater than or equal to
    }

    // 3. Filter by specific Destination
    if (destinationId) {
      query.destination = destinationId;
    }

    const packages = await Package.find(query)
      .populate("agency", "firstName lastName email")
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
