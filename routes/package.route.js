const express = require("express");
const { validateToken, isAgency } = require("../middlewares/auth.middleware");
const {
  createPackage,
  getAllPackages,
  getPackageById,
} = require("../controllers/package.controller");

const router = express.Router();

// Public routes: Visitors can browse packages
router.get("/", getAllPackages);
router.get("/:id", getPackageById);

// Protected routes: Only Agencies can create packages
router.post("/", validateToken, isAgency, createPackage);

module.exports = router;
