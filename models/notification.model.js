const { Schema, model } = require("mongoose");

// notification for booking, system and reminder
const NotificationSchema = new Schema({
  // Notification Schema
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["booking", "system", "reminder"] },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = model("Notification", NotificationSchema);
module.exports = Notification;
