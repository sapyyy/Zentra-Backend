const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");

const router = express.Router();

// Get your own profile
router.get("/profile", validateToken, getUserProfile);

// Update your profile (uses upload.single for a single profile picture)
router.put(
  "/profile",
  validateToken,
  upload.single("profilePicture"),
  updateUserProfile,
);

module.exports = router;
