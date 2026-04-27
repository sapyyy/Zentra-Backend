const express = require("express");
const {
  validateToken,
  isTransportOwner,
} = require("../middlewares/auth.middleware");
const {
  createTransport,
  getAllTransports,
} = require("../controllers/transport.controller");

const router = express.Router();

router.get("/", getAllTransports);

// Protected: Only Transport Owners can post
router.post("/", validateToken, isTransportOwner, createTransport);

module.exports = router;
