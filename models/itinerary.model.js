const { Schema, model } = require("mongoose");

// custom itinerary for the user to plan their own package
const ItinerarySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  dailyPlan: [
    {
      date: { type: Date },
      notes: { type: String },
      savedItems: [
        {
          itemType: {
            type: String,
            enum: ["Destination", "Hotel", "Transport"],
          },
          itemId: {
            type: Schema.Types.ObjectId,
            refPath: "dailyPlan.savedItems.itemType",
          },
        },
      ],
    },
  ],
});

const Itinerary = model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
