const express = require("express");
const {
  validateToken,
  isHotelOwner,
} = require("../middlewares/auth.middleware");
const {
  createHotel,
  getAllHotels,
} = require("../controllers/hotel.controller");
const upload = require("../config/cloudinary");

const router = express.Router();

router.get("/", getAllHotels);

// Protected: Only Hotel Owners can post, Multer handles the images
router.post(
  "/",
  validateToken,
  isHotelOwner,
  upload.array("images", 5),
  createHotel,
);

module.exports = router;
