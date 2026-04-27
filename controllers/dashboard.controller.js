const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Destination = require("../models/destination.model");
const Package = require("../models/package.schema");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts (Using Promise.all for parallel execution)
    const [totalUsers, totalDestinations, totalPackages] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Package.countDocuments(),
    ]);

    // 2. Revenue & Bookings Aggregation
    // This groups all bookings together and sums up the totalAmount field
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const revenue = bookingStats.length > 0 ? bookingStats[0].totalRevenue : 0;
    const bookingsCount =
      bookingStats.length > 0 ? bookingStats[0].totalBookings : 0;

    // 3. User Roles Breakdown
    // Counts how many visitors, agencies, admins, etc., exist
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // 4. Recent Bookings (Fetch the 5 newest bookings for the activity feed)
    const recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .limit(5)
      .populate("user", "firstName lastName email")
      .populate("itemId", "title name type"); // Generic fields that cover Packages, Destinations, and Transports

    return res.status(200).json({
      overview: {
        totalUsers,
        totalDestinations,
        totalPackages,
        totalRevenue: revenue,
        totalBookings: bookingsCount,
      },
      usersByRole,
      recentBookings,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching dashboard stats", error: err.message });
  }
};

module.exports = { getDashboardStats };
