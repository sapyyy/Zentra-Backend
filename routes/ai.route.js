const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  chatWithGuide,
  generateItinerary,
} = require("../controllers/ai.controller");

const router = express.Router();

// Protected routes to prevent API abuse
router.post("/chat", validateToken, chatWithGuide);
router.post("/generate-itinerary", validateToken, generateItinerary);

module.exports = router;
