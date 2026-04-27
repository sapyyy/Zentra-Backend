const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  getUserNotifications,
  markAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", validateToken, getUserNotifications);
router.patch("/:id/read", validateToken, markAsRead);

module.exports = router;
