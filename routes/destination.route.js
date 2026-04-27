const express = require("express");
const { validateToken, isAdmin } = require("../middlewares/auth.middleware");
const {
  createDestination,
  getAllDestinations,
  getDestinationById,
} = require("../controllers/destination.controller");
const upload = require("../config/cloudinary");

const router = express.Router();

// Public routes: Anyone can browse destinations
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

// Protected routes: You must be logged in to add a destination
router.post(
  "/",
  validateToken,
  isAdmin,
  upload.array("images", 5),
  createDestination,
);

module.exports = router;
