const User = require("../models/user.model");

// Get the logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// Update the logged-in user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    // Build the update object dynamically so we only update fields the user actually sent
    let updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // If Multer intercepted a file, grab the Cloudinary URL
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    // Find the user by their JWT ID and update them
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }, // Return the updated document
    ).select("-password -otp -otpExpires");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
