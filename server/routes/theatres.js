const express = require("express");
const router = express.Router();
const Theatre = require("../models/Theatre");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/theatres — list all (public)
router.get("/", async (req, res) => {
    try {
        const { city } = req.query;
        const filter = city && city !== "All" ? { city } : {};
        const theatres = await Theatre.find(filter).sort({ city: 1, name: 1 });
        res.json({ success: true, theatres });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/theatres — create (admin)
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const theatre = await Theatre.create(req.body);
        res.status(201).json({ success: true, theatre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/theatres/:id — update (admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!theatre) {
            return res.status(404).json({ success: false, message: "Theatre not found" });
        }
        res.json({ success: true, theatre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/theatres/:id — delete (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const theatre = await Theatre.findByIdAndDelete(req.params.id);
        if (!theatre) {
            return res.status(404).json({ success: false, message: "Theatre not found" });
        }
        res.json({ success: true, message: "Theatre deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
