const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");

const {
  validateUser,
  validateToken,
} = require("../middlewares/auth.middleware");
const {
  authControllerRegister,
  authControllerLogin,
} = require("../controllers/auth.controller");

router.post(
  "/register",
  upload.single("profilePicture"),
  validateUser,
  authControllerRegister,
);
router.post("/login", authControllerLogin);

module.exports = router;
