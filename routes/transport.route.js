const express = require("express");
const {
  validateToken,
  isTransportOwner,
} = require("../middlewares/auth.middleware");
const {
  createTransport,
  getAllTransports,
  updateTransport,
  deleteTransport,
} = require("../controllers/transport.controller");

const router = express.Router();

router.get("/", getAllTransports);

// Protected: Only Transport Owners can post
router.post("/", validateToken, isTransportOwner, createTransport);

// Update an existing transport
router.put("/:id", validateToken, isTransportOwner, updateTransport);

// Delete a transport
router.delete("/:id", validateToken, isTransportOwner, deleteTransport);

module.exports = router;
