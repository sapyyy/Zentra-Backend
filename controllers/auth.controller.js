const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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
    return res.status(409).json({
      message: "Email/Password can't be empty",
    });
  }

  try {
    // checking whether the email password exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(409).json({
        message: "No user registered with that email",
      });
    }

    // using bcrypt to compare the password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid Password",
      });
    }

    // generating jwt token for the login - NOW INCLUDES ID AND ROLE
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
    );

    // storing it inside the cookie
    res.cookie("authcookie", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login successfull",
    });
  } catch (err) {
    return res.status(500).json({ message: "Login unsuccessfull!" });
  }
};

module.exports = {
  authControllerRegister,
  authControllerLogin,
};
