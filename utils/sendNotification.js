const Notification = require("../models/notification.model");

const sendNotification = async (userId, title, message, type = "system") => {
  try {
    const newNotification = new Notification({
      user: userId,
      title,
      message,
      type, // "booking", "system", or "reminder"
    });

    await newNotification.save();
    // In a real-time app, you would also trigger a WebSocket/Socket.io event here
  } catch (error) {
    console.error("Failed to save notification:", error.message);
  }
};

module.exports = sendNotification;
