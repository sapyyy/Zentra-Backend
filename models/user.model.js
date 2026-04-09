const { model, Schema } = require("mongoose");

// creating userschema which has enums for the five roles (admin, agency, visitor, hotel-owner and transport-owner)
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["visitor", "agency", "admin", "hotel-owner", "transport-owner"],
    default: "visitor",
  },
  profilePicture: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", UserSchema);
module.exports = User;
