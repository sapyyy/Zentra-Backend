const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// controller to register an user
const authControllerRegister = async (req, res) => {
  const { email, password, firstName, lastName, role, profilePicture } =
    req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Email/Password can't be empty!",
    });
  }

  try {
    // check whether any user exists with the email
    const existingUser = await User.findOne({ email });

    // if there's existing user then return error
    if (existingUser) {
      return res.status(409).json({
        message: "Duplicated user not allowed",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    // create an user document here
    const newUser = new User({
      email: email,
      password: hashPass,
      firstName: firstName,
      lastName: lastName,
      role: role,
      profilePicture,
    });
    const userCreated = await newUser.save();

    // creating a jwt token here - NOW INCLUDES ID AND ROLE
    const token = jwt.sign(
      {
        id: userCreated._id,
        email: userCreated.email,
        role: userCreated.role,
      },
      process.env.JWT_SECRET,
    );

    // lastly storing it inside the cookie for future logins
    // maxAge is 7 days
    res.cookie("authcookie", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User registration successfull",
      user: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
      },
    });
  } catch (err) {
    return res.status(409).json({
      message: "User registration error!",
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
