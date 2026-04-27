const Review = require("../models/review.model");
const Booking = require("../models/booking.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    if (!targetType || !targetId || !rating) {
      return res
        .status(400)
        .json({ message: "targetType, targetId, and rating are required." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Advanced Logic: Verified Purchase Check
    // We allow anyone to review a "Destination", but Hotels and Packages require a booking
    if (targetType === "Hotel" || targetType === "Package") {
      const hasBooked = await Booking.findOne({
        user: req.user.id,
        itemId: targetId,
        // Optional: you could add bookingStatus: "completed" to ensure they already went on the trip
      });

      if (!hasBooked) {
        return res.status(403).json({
          message: `You can only review a ${targetType} that you have successfully booked.`,
        });
      }
    }

    const newReview = new Review({
      user: req.user.id, // Securely from JWT
      targetType,
      targetId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    return res
      .status(201)
      .json({ message: "Review posted successfully", review: savedReview });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error posting review", error: err.message });
  }
};

// Get all reviews for a specific item (Hotel, Package, or Destination)
const getReviewsForTarget = async (req, res) => {
  try {
    const { targetId } = req.params;

    // Fetch reviews and populate the user details so the frontend can show names/avatars
    const reviews = await Review.find({ targetId })
      .populate("user", "firstName lastName profilePicture")
      .sort({ createdAt: -1 }); // Newest reviews first

    // Optional: Calculate the average rating on the fly
    const totalRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    return res.status(200).json({
      averageRating,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
};

module.exports = { createReview, getReviewsForTarget };
