const express = require("express");
const { validateToken, isAdmin } = require("../middlewares/auth.middleware");
const { getDashboardStats } = require("../controllers/dashboard.controller");

const router = express.Router();

// Protected: Only Admins can view the analytics dashboard
router.get("/stats", validateToken, isAdmin, getDashboardStats);

module.exports = router;
