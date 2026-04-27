const Notification = require("../models/notification.model");

// Fetch all notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Newest first

    // Count how many are unread for the badge icon on the frontend
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({ unreadCount, notifications });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching notifications", error: err.message });
  }
};

// Mark a specific notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure they only edit their own!
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Marked as read", notification });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating notification", error: err.message });
  }
};

module.exports = { getUserNotifications, markAsRead };
