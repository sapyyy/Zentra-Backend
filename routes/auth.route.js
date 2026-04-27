const express = require("express");
const router = express.Router();

const {
  validateUser,
  validateToken,
} = require("../middlewares/auth.middleware");
const {
  authControllerRegister,
  authControllerLogin,
} = require("../controllers/auth.controller");

router.post("/register", validateUser, authControllerRegister);
router.post("/login", authControllerLogin);

module.exports = router;
