const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/auth");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({ name, email, password });
        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        generateToken(res, user._id);

        res.json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
    res.json({
        success: true,
        user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
});

module.exports = router;
