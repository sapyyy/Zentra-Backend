const z = require("zod");
const dotenv = require("dotenv");
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

module.exports = { validateUser, validateToken };
