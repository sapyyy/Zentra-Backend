const z = require("zod");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const newUser = z.object({
  email: z.string(),
  password: z
    .string()
    .min(6, "The password should be atleast 6 characters long"),
  firstName: z.string().min(1, "The first name can't be empty"),
  lastName: z.string().min(1, "The last name can't be empty"),
  role: z.enum(["visitor", "agency", "hotel-owner", "transport-owner"]),
});

const validateUser = (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;

  // trying to parse
  try {
    newUser.parse({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: role,
    });
    return next();
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

const validateToken = (req, res, next) => {
  const authCookie = req.cookies["authcookie"];

  // return error if no cookies found
  if (authCookie == null)
    return res.status(401).json({
      message: "No cookies found!",
    });

  // verify if there's any cookie
  jwt.verify(authCookie, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        message: "Unable to get the user",
      });

    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  // validateToken already verified the user and attached them to req.user
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Access denied. Admin privileges required to perform this action.",
    });
  }

  // If they are an admin, let them proceed to the controller
  next();
};

const isAgency = (req, res, next) => {
  // Ensure the user is logged in and has the agency role
  if (!req.user || req.user.role !== "agency") {
    return res.status(403).json({
      message:
        "Access denied. Only registered travel agencies can create packages.",
    });
  }

  next();
};

const isHotelOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "hotel-owner") {
    return res.status(403).json({
      message: "Access denied. Only hotel owners can perform this action.",
    });
  }
  next();
};

const isTransportOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "transport-owner") {
    return res.status(403).json({
      message: "Access denied. Only transport owners can perform this action.",
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateToken,
  isAdmin,
  isAgency,
  isHotelOwner,
  isTransportOwner,
};
