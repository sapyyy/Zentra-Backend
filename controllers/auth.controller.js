const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const sendEmail = require("../utils/sendEmail");

// controller to register an user
const authControllerRegister = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email/Password can't be empty!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Duplicated user not allowed",
      });
    }

    // 2. Extract the Cloudinary URL if a file was uploaded
    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = req.file.path; // Multer-Cloudinary stores the URL in 'path'
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    // 3. Save the new user with the extracted URL
    const newUser = new User({
      email: email,
      password: hashPass,
      firstName: firstName,
      lastName: lastName,
      role: role,
      profilePicture: profilePictureUrl, // Assign the URL here
    });

    const userCreated = await newUser.save();

    const token = jwt.sign(
      {
        id: userCreated._id,
        email: userCreated.email,
        role: userCreated.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("authcookie", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User registration successful",
      user: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
        profilePicture: profilePictureUrl, // Send it back to the frontend to display instantly
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "User registration error!",
      error: err.message,
    });
  }
};

// controller to login a user
const authControllerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email/Password can't be empty" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "No user registered with that email" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // --- NEW 2FA LOGIC ---
    // 1. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Hash it before saving to the database (Best Practice)
    const salt = await bcrypt.genSalt(10);
    existingUser.otp = await bcrypt.hash(otp, salt);
    existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 mins
    await existingUser.save();

    // 3. Send it via email
    const message = `Your Zentra login verification code is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail({
      email: existingUser.email,
      subject: "Zentra - Your Login OTP",
      message: message,
    });

    // Notice we DO NOT send the JWT cookie here anymore!
    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete login.",
      email: existingUser.email, // Send email back so frontend knows who is verifying
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

// NEW OTP VERIFICATION CONTROLLER
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < Date.now()) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP has expired. Please login again." });
    }

    // Compare the hashed OTP
    const isMatch = await bcrypt.compare(otp.toString(), user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Success! Clear the OTP fields
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // NOW we issue the JWT cookie
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
    );

    res.cookie("authcookie", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

module.exports = {
  authControllerRegister,
  authControllerLogin,
  verifyOTP, // Export the new controller
};
