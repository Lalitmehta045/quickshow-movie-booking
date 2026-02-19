const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/users — list all (admin)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/users/:id — update user profile
router.put("/:id", protect, async (req, res) => {
    try {
        // Users can update themselves, admins can update anyone
        if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/users/:id — delete user (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
