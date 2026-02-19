const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { protect, adminOnly } = require("../middleware/auth");
const mongoose = require("mongoose");

const axios = require("axios");

// GET /api/movies — list all (public) with optional search/genre filter
router.get("/", async (req, res) => {
    try {
        const { search, genre, upcoming } = req.query;
        let movies = [];

        // 1. Fetch from Local DB
        const filter = { isActive: true };

        if (upcoming === "true") {
            filter.isUpcoming = true;
        } else if (upcoming === "false") {
            filter.isUpcoming = false;
        }

        if (genre && genre !== "All") {
            filter.genres = genre;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { director: { $regex: search, $options: "i" } },
                { genres: { $regex: search, $options: "i" } },
            ];
        }

        const localMovies = await Movie.find(filter).sort({ createdAt: -1 });
        movies = [...localMovies];

        // 2. Fetch from TMDB if searching
        if (search && process.env.TMDB_API_KEY) {
            try {
                const tmdbRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        query: search,
                    },
                });

                const tmdbMovies = tmdbRes.data.results
                    .filter((m) => m.poster_path) // Only with posters
                    .map((m) => ({
                        _id: `tmdb-${m.id}`, // Custom ID to identify external
                        title: m.title,
                        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                        genres: ["Unknown"], // TMDB returns IDs, skipping mapping for simplicity or fetch genre list if needed
                        year: m.release_date ? parseInt(m.release_date.split("-")[0]) : 0,
                        rating: m.vote_average / 2, // Scale 10 to 5
                        isUpcoming: true, // External movies are always treated as upcoming (not bookable)
                        isActive: true,
                    }));

                // Deduplicate (prefer local)
                const localTitles = new Set(localMovies.map((m) => m.title.toLowerCase()));
                const newExternal = tmdbMovies.filter((m) => !localTitles.has(m.title.toLowerCase()));

                movies = [...movies, ...newExternal];
            } catch (err) {
                console.error("TMDB Search Error:", err.message);
            }
        }

        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/movies/all — list all includings inactive (admin)
router.get("/all", protect, adminOnly, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/movies/:id — single movie (public)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Try Local DB
        if (mongoose.Types.ObjectId.isValid(id)) {
            const movie = await Movie.findById(id);
            if (movie) {
                return res.json({ success: true, movie });
            }
        }

        // 2. Try TMDB if it looks like a TMDB ID
        console.log(`Checking movie ID: ${id}. TMDB Key present: ${!!process.env.TMDB_API_KEY}`);
        if (id.startsWith("tmdb-") && process.env.TMDB_API_KEY) {
            const tmdbId = id.replace("tmdb-", "");
            console.log(`Fetching TMDB ID: ${tmdbId}`);
            try {
                const [movieRes, creditsRes] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
                        params: { api_key: process.env.TMDB_API_KEY },
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
                        params: { api_key: process.env.TMDB_API_KEY },
                    }),
                ]);

                const m = movieRes.data;
                const c = creditsRes.data;

                const movie = {
                    _id: id,
                    title: m.title,
                    poster: `https://image.tmdb.org/t/p/original${m.poster_path}`,
                    backdrop: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,
                    synopsis: m.overview,
                    year: m.release_date ? parseInt(m.release_date.split("-")[0]) : 0,
                    genres: m.genres.map((g) => g.name),
                    duration: `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`,
                    rating: m.vote_average / 2,
                    director: c.crew.find((p) => p.job === "Director")?.name || "Unknown",
                    cast: c.cast.slice(0, 5).map((a) => a.name),
                    isUpcoming: true, // Not bookable
                    ticketPrice: 0,
                    showtimes: [],
                    isActive: true,
                };

                return res.json({ success: true, movie });
            } catch (err) {
                console.error("TMDB Detail Error:", err.message);
                return res.status(404).json({ success: false, message: "Movie not found" });
            }
        }

        return res.status(404).json({ success: false, message: "Movie not found" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/movies — create (admin)
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/movies/:id — update (admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/movies/:id — delete (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.json({ success: true, message: "Movie deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
