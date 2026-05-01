const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  saveItinerary,
  getUserItineraries,
  deleteItinerary,
} = require("../controllers/itinerary.controller");

const router = express.Router();

// Save a new itinerary
router.post("/", validateToken, saveItinerary);

// Get all saved itineraries for the dashboard
router.get("/", validateToken, getUserItineraries);

// Delete an itinerary
router.delete("/:id", validateToken, deleteItinerary);

module.exports = router;
