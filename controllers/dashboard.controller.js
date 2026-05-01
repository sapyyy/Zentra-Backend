const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Destination = require("../models/destination.model");
const Package = require("../models/package.schema");
const Hotel = require("../models/hotel.model");
const Transport = require("../models/transport.model");

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

// Smart Vendor Dashboard
const getVendorDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let vendorItems = [];
    let totalListings = 0;

    // 1. Find all items owned by this specific vendor based on their role
    if (role === "agency") {
      vendorItems = await Package.find({ agency: userId }).select("_id");
    } else if (role === "hotel-owner") {
      // Note: Assuming your Hotel schema uses 'owner' (adjust if it uses a different key)
      vendorItems = await Hotel.find({ owner: userId }).select("_id");
    } else if (role === "transport-owner") {
      vendorItems = await Transport.find({ owner: userId }).select("_id");
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have a vendor role." });
    }

    totalListings = vendorItems.length;

    // Extract just the raw IDs to use in our Booking query
    const itemIds = vendorItems.map((item) => item._id);

    // 2. Aggregate Revenue and Total Bookings ONLY for this vendor's items
    const bookingStats = await Booking.aggregate([
      { $match: { itemId: { $in: itemIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const revenue = bookingStats.length > 0 ? bookingStats[0].totalRevenue : 0;
    const totalBookings =
      bookingStats.length > 0 ? bookingStats[0].totalBookings : 0;

    // 3. Get their 5 most recent bookings for the activity feed
    const recentBookings = await Booking.find({ itemId: { $in: itemIds } })
      .sort({ createdAt: -1 }) // Assuming you have timestamps enabled
      .limit(5)
      .populate("user", "firstName lastName email")
      .populate("itemId", "title name type"); // Polymorphic population

    return res.status(200).json({
      role: role,
      overview: {
        totalListings,
        totalBookings,
        totalRevenue: revenue,
      },
      recentBookings,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching vendor stats", error: err.message });
  }
};

module.exports = { getDashboardStats, getVendorDashboardStats };
