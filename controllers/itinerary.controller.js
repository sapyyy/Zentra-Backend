const Itinerary = require("../models/itinerary.model");

// Save a newly generated AI itinerary to the user's profile
const saveItinerary = async (req, res) => {
  try {
    const { destination, title, duration, budgetLevel, days } = req.body;

    if (!destination || !days || days.length === 0) {
      return res.status(400).json({ message: "Incomplete itinerary data." });
    }

    const newItinerary = new Itinerary({
      user: req.user.id,
      destination,
      title,
      duration,
      budgetLevel,
      days,
    });

    const savedItinerary = await newItinerary.save();

    return res.status(201).json({
      message: "Itinerary saved successfully!",
      itinerary: savedItinerary,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error saving itinerary", error: err.message });
  }
};

// Fetch all saved itineraries for the logged-in user
const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Newest first

    return res.status(200).json({ itineraries });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching itineraries", error: err.message });
  }
};

// Optional: Delete an itinerary if the user changes their mind
const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Security check: Ensure they own it!
    });

    if (!itinerary) {
      return res
        .status(404)
        .json({ message: "Itinerary not found or unauthorized." });
    }

    return res.status(200).json({ message: "Itinerary deleted successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting itinerary", error: err.message });
  }
};

module.exports = { saveItinerary, getUserItineraries, deleteItinerary };
