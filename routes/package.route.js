const express = require("express");
const { validateToken, isAgency } = require("../middlewares/auth.middleware");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("../controllers/package.controller");
// Import your Cloudinary upload middleware
const upload = require("../config/cloudinary");

const router = express.Router();

// Public routes: Visitors can browse packages
router.get("/", getAllPackages);
router.get("/:id", getPackageById);

// Protected routes: Only Agencies can create packages
router.post(
  "/",
  validateToken,
  isAgency,
  upload.array("images", 5),
  createPackage,
);
// Update an existing package
router.put(
  "/:id",
  validateToken,
  isAgency,
  upload.array("images", 5),
  updatePackage,
);

// Delete a package
router.delete("/:id", validateToken, isAgency, deletePackage);

module.exports = router;
