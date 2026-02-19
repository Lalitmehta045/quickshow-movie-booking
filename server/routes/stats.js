const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Movie = require("../models/Movie");
const Booking = require("../models/Booking");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/stats — admin dashboard stats
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const [totalUsers, totalMovies, totalBookings, revenueData] = await Promise.all([
            User.countDocuments(),
            Movie.countDocuments({ isActive: true }),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
            ]),
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

        // Recent bookings
        const recentBookings = await Booking.find()
            .populate("movie", "title poster")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalMovies,
                totalBookings,
                totalRevenue,
                cancelledBookings,
                confirmedBookings: totalBookings - cancelledBookings,
            },
            recentBookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
