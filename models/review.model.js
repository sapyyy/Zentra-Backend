const { Schema, model } = require("mongoose");

// review schema for getting reviews for destinations
const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  targetType: {
    type: String,
    enum: ["Package", "Hotel", "Destination"],
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "targetType",
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Review = model("Review", ReviewSchema);
module.exports = Review;
