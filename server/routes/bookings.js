const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/bookings — user's bookings or all (admin)
router.get("/", protect, async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { user: req.user._id };
        const bookings = await Booking.find(filter)
            .populate("movie", "title poster genres duration")
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bookings — create booking
router.post("/", protect, async (req, res) => {
    try {
        const { movieId, date, time, seats } = req.body;

        if (!movieId || !date || !time || !seats || seats.length === 0) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        // Check for duplicate seats
        const existingBookings = await Booking.find({
            movie: movieId,
            date,
            time,
            status: "confirmed",
            seats: { $in: seats },
        });

        if (existingBookings.length > 0) {
            const takenSeats = existingBookings.flatMap((b) => b.seats).filter((s) => seats.includes(s));
            return res.status(400).json({
                success: false,
                message: `Seats already booked: ${takenSeats.join(", ")}`,
            });
        }

        const totalPrice = seats.length * movie.ticketPrice;

        const booking = await Booking.create({
            user: req.user._id,
            movie: movieId,
            date,
            time,
            seats,
            totalPrice,
        });

        const populated = await booking.populate("movie", "title poster genres duration");

        res.status(201).json({ success: true, booking: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/bookings/:id/cancel — cancel booking
router.put("/:id/cancel", protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Only owner or admin can cancel
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/bookings/booked-seats — get booked seats for a movie/date/time
router.get("/booked-seats", protect, async (req, res) => {
    try {
        const { movieId, date, time } = req.query;
        const bookings = await Booking.find({
            movie: movieId,
            date,
            time,
            status: "confirmed",
        });
        const bookedSeats = bookings.flatMap((b) => b.seats);
        res.json({ success: true, bookedSeats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
