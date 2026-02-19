const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const User = require("./models/User");
const Movie = require("./models/Movie");
const Theatre = require("./models/Theatre");
const Booking = require("./models/Booking");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    console.error("❌ TMDB_API_KEY is missing in .env");
    process.exit(1);
}

const fetchMovies = async (endpoint, limit = 8) => {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    return data.results.slice(0, limit);
};

const getMovieDetails = async (id) => {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
    return data;
};

const generateShowtimes = (days = 3) => {
    const times = ["10:00 AM", "1:30 PM", "5:00 PM", "9:00 PM"];
    const showtimes = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        showtimes.push({
            date: date.toISOString().split("T")[0],
            times: times.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2)), // 3-4 random times
        });
    }
    return showtimes;
};

const formatDuration = (runtime) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
};

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Movie.deleteMany({});
        await Theatre.deleteMany({});
        await Booking.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Create users
        await User.create({
            name: "Admin",
            email: "admin@quickshow.com",
            password: "admin123",
            role: "admin",
        });
        console.log("👤 Admin created: admin@quickshow.com / admin123");

        await User.create({
            name: "Test User",
            email: "user@quickshow.com",
            password: "user123",
            role: "user",
        });
        console.log("👤 Test user created: user@quickshow.com / user123");

        // Fetch movies from TMDB
        console.log("🎬 Fetching movies from TMDB...");
        const nowPlaying = await fetchMovies("now_playing", 12);
        const upcoming = await fetchMovies("upcoming", 6);

        const processMovie = async (movie, isUpcoming) => {
            try {
                const details = await getMovieDetails(movie.id);
                const trailer = details.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

                return {
                    title: details.title,
                    year: new Date(details.release_date).getFullYear(),
                    genres: details.genres.map((g) => g.name),
                    duration: formatDuration(details.runtime),
                    rating: Number((details.vote_average / 2).toFixed(1)), // Scale to 5
                    poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
                    synopsis: details.overview,
                    cast: details.credits.cast.slice(0, 5).map((c) => c.name),
                    director: details.credits.crew.find((c) => c.job === "Director")?.name || "Unknown",
                    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
                    showtimes: isUpcoming ? [] : generateShowtimes(),
                    ticketPrice: Math.floor(Math.random() * (400 - 150 + 1) + 150), // 150-400
                    isUpcoming,
                    releaseDate: isUpcoming ? new Date(details.release_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "",
                    isActive: true,
                };
            } catch (err) {
                console.error(`⚠️ Failed to process movie ${movie.title}: ${err.message}`);
                return null;
            }
        };

        // Process all movies
        const movieDocs = [];

        for (const m of nowPlaying) {
            const doc = await processMovie(m, false);
            if (doc) movieDocs.push(doc);
        }

        for (const m of upcoming) {
            const doc = await processMovie(m, true);
            if (doc) movieDocs.push(doc);
        }

        await Movie.insertMany(movieDocs);
        console.log(`✅ Seeded ${movieDocs.length} movies from TMDB`);

        // Seed theatres
        await Theatre.insertMany([
            { name: "QuickShow Cinemas — Downtown", city: "Mumbai", address: "123 Marine Drive, Colaba", screens: 8, features: ["IMAX", "Dolby Atmos", "4DX"] },
            { name: "QuickShow Cinemas — Bandra", city: "Mumbai", address: "Plot 45, Linking Road, Bandra West", screens: 6, features: ["Dolby Atmos", "Recliner Seats"] },
            { name: "QuickShow Cinemas — Connaught Place", city: "Delhi", address: "Block C, CP Inner Circle", screens: 10, features: ["IMAX", "Dolby Atmos", "4DX", "Screening Lounge"] },
            { name: "QuickShow Cinemas — Noida", city: "Delhi", address: "Sector 18, DLF Mall of India", screens: 7, features: ["Dolby Atmos", "Recliner Seats", "4DX"] },
            { name: "QuickShow Cinemas — Koramangala", city: "Bangalore", address: "80 Feet Road, Koramangala 4th Block", screens: 5, features: ["Dolby Atmos", "Recliner Seats"] },
            { name: "QuickShow Cinemas — Whitefield", city: "Bangalore", address: "Phoenix Marketcity, Whitefield", screens: 9, features: ["IMAX", "Dolby Atmos", "RPX"] },
            { name: "QuickShow Cinemas — Anna Nagar", city: "Chennai", address: "VR Mall, Anna Nagar West", screens: 6, features: ["Dolby Atmos", "4DX"] },
            { name: "QuickShow Cinemas — Salt Lake", city: "Kolkata", address: "City Centre, Salt Lake Sector V", screens: 5, features: ["Dolby Atmos", "Recliner Seats"] },
        ]);
        console.log(`✅ Seeded 8 theatres`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedData();
