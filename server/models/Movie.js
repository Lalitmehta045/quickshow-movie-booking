const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
    {
        date: { type: String, required: true },
        times: [{ type: String, required: true }],
    },
    { _id: false }
);

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        year: {
            type: Number,
            required: true,
        },
        genres: [{ type: String, required: true }],
        duration: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        poster: {
            type: String,
            default: "",
        },
        synopsis: {
            type: String,
            default: "",
        },
        cast: [{ type: String }],
        director: {
            type: String,
            default: "",
        },
        trailerUrl: {
            type: String,
            default: "",
        },
        showtimes: [showtimeSchema],
        ticketPrice: {
            type: Number,
            required: true,
            default: 250,
        },
        isUpcoming: {
            type: Boolean,
            default: false,
        },
        releaseDate: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Text index for search
movieSchema.index({ title: "text", synopsis: "text", director: "text" });

module.exports = mongoose.model("Movie", movieSchema);
