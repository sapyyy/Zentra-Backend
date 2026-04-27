const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  createReview,
  getReviewsForTarget,
} = require("../controllers/review.controller");

const router = express.Router();

// Public: Anyone can read reviews for an item
router.get("/:targetId", getReviewsForTarget);

// Protected: You must be logged in to leave a review
router.post("/", validateToken, createReview);

module.exports = router;
