const express = require("express");
const { validateToken, isAdmin } = require("../middlewares/auth.middleware");
const {
  getDashboardStats,
  getVendorDashboardStats,
} = require("../controllers/dashboard.controller");

const router = express.Router();

// Quick custom middleware to check if user is a vendor
const isVendor = (req, res, next) => {
  const allowedRoles = ["agency", "hotel-owner", "transport-owner"];
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied. Vendor resources only." });
  }
  next();
};

// Protected: Only Admins can view the analytics dashboard
router.get("/stats", validateToken, isAdmin, getDashboardStats);

// Protected Vendor Route
router.get("/vendor-stats", validateToken, isVendor, getVendorDashboardStats);

module.exports = router;
