const express = require("express");
const {
  validateUser,
  validateToken,
} = require("../middlewares/auth.middleware");
const {
  authControllerRegister,
  authControllerLogin,
} = require("../controllers/auth.controller");
const router = express();

router.post("/register", validateUser, authControllerRegister);
router.post("/login", authControllerLogin);

module.exports = router;
