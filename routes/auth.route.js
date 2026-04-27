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
  verifyOTP,
} = require("../controllers/auth.controller");

router.post(
  "/register",
  upload.single("profilePicture"),
  validateUser,
  authControllerRegister,
);
router.post("/login", authControllerLogin);
router.post("/verify-otp", verifyOTP);

module.exports = router;
