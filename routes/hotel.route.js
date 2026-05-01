const express = require("express");
const {
  validateToken,
  isHotelOwner,
} = require("../middlewares/auth.middleware");
const {
  createHotel,
  getAllHotels,
  updateHotel,
  deleteHotel,
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

// Update an existing hotel
router.put(
  "/:id",
  validateToken,
  isHotelOwner,
  upload.array("images", 5),
  updateHotel,
);

// Delete a hotel
router.delete("/:id", validateToken, isHotelOwner, deleteHotel);

module.exports = router;
