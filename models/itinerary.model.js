const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "My Custom Trip",
    },
    duration: {
      type: String, // e.g., "3 Days"
      required: true,
    },
    budgetLevel: {
      type: String,
      enum: ["budget", "moderate", "luxury"],
      default: "moderate",
    },
    // We store the AI's generated days as an array of objects
    days: [
      {
        dayNumber: Number,
        theme: String,
        activities: [
          {
            time: String,
            activity: String,
            location: String,
            costEstimate: String,
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Itinerary", ItinerarySchema);
