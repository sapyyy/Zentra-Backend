const Hotel = require("../models/hotel.model");

const createHotel = async (req, res) => {
  try {
    const { name, destination, address } = req.body;

    if (!name || !destination || !address) {
      return res
        .status(400)
        .json({ message: "Name, destination, and address are required." });
    }

    // 1. Parse the complex form-data strings back into JSON/Arrays
    let parsedFeatures = [];
    if (req.body.features) {
      parsedFeatures = JSON.parse(req.body.features); // e.g., '["Pool", "WiFi"]' -> ["Pool", "WiFi"]
    }

    let parsedRoomTypes = [];
    if (req.body.roomTypes) {
      parsedRoomTypes = JSON.parse(req.body.roomTypes);
    }

    // 2. Extract Cloudinary URLs
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    // 3. Create the document, forcing the owner to be the logged-in JWT user
    const newHotel = new Hotel({
      owner: req.user.id,
      name,
      destination,
      address,
      features: parsedFeatures,
      roomTypes: parsedRoomTypes,
      images: imageUrls,
    });

    const savedHotel = await newHotel.save();
    return res
      .status(201)
      .json({ message: "Hotel created successfully", hotel: savedHotel });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating hotel", error: err.message });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate("owner", "firstName lastName email")
      .populate("destination", "name country");
    return res.status(200).json({ hotels });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching hotels", error: err.message });
  }
};

module.exports = { createHotel, getAllHotels };
