const { model, Schema } = require("mongoose");

// package schema has foreign key of the user for the role 'agent' who will be able to post
// multiple destination (another foreign key)
const PackageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  agency: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: "Destination",
  },
  duration: {
    days: { type: Number },
    nights: { type: Number },
  },
  price: {
    type: Number,
    required: true,
  },
  // itinerary consists of the activites offered by the agency for each day in the trip
  itinerary: [
    {
      day: {
        type: Number,
      },
      title: {
        type: String,
      },
      activities: [{ type: String }],
    },
  ],
  // inclusions consist of the benifits included (eg: Breakfast, Lunch, Airport Transfer)
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  images: [{ type: String }],
  availability: { type: Number },
});

const Package = model("Package", PackageSchema);
module.exports = Package;
