import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";

export interface Showtime {
  date: string;
  times: string[];
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string;
  duration: string;
  rating: number;
  poster: string;
  synopsis: string;
  cast: string[];
  director: string;
  trailerUrl: string;
  showtimes: Showtime[];
  ticketPrice: number;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Cyber Sentinel",
    year: 2024,
    genres: "Action, Sci-Fi",
    duration: "2h 8m",
    rating: 4.5,
    poster: movie1,
    synopsis:
      "In a dystopian future where artificial intelligence governs every aspect of society, a rogue cybersecurity expert discovers a hidden algorithm threatening to erase human free will. Racing against time, she must navigate a neon-lit underworld of hackers and rogue AIs to prevent a digital apocalypse that could enslave humanity forever.",
    cast: ["Anya Sharma", "Kai Nakamura", "Elena Voss", "Marcus Chen"],
    director: "James Holloway",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["10:00 AM", "1:30 PM", "5:00 PM", "9:00 PM"] },
      { date: "2026-02-21", times: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"] },
      { date: "2026-02-22", times: ["10:30 AM", "1:00 PM", "4:30 PM", "8:00 PM"] },
    ],
    ticketPrice: 250,
  },
  {
    id: 2,
    title: "The Steals",
    year: 2023,
    genres: "Action, Adventure",
    duration: "2h 22m",
    rating: 4.7,
    poster: movie2,
    synopsis:
      "A legendary art thief assembles a crew of misfits for one last heist — stealing a priceless artifact from the most fortified museum in the world. As alliances shift and betrayals surface, the team must outwit both a relentless detective and a ruthless crime lord who wants the artifact for himself.",
    cast: ["Leo Hartman", "Sofia Reyes", "Omar Farid", "Jade Liu"],
    director: "Isabella Moretti",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["9:30 AM", "12:45 PM", "4:00 PM", "8:30 PM"] },
      { date: "2026-02-21", times: ["10:15 AM", "1:45 PM", "5:15 PM", "9:00 PM"] },
      { date: "2026-02-22", times: ["11:00 AM", "2:00 PM", "5:30 PM", "8:45 PM"] },
    ],
    ticketPrice: 280,
  },
  {
    id: 3,
    title: "Flame Warden",
    year: 2024,
    genres: "Fantasy, Action",
    duration: "2h 15m",
    rating: 4.3,
    poster: movie3,
    synopsis:
      "In a realm where elemental magic shapes civilizations, a young fire-wielder is chosen by an ancient dragon to become the Flame Warden — the last guardian against an encroaching darkness. She must master her volatile powers and unite the warring elemental clans before the shadow consumes everything.",
    cast: ["Mira Johansson", "Ravi Patel", "Freya Lindström", "Darius Moon"],
    director: "Chen Wei",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["10:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"] },
      { date: "2026-02-21", times: ["11:30 AM", "3:00 PM", "7:00 PM"] },
      { date: "2026-02-22", times: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"] },
    ],
    ticketPrice: 260,
  },
  {
    id: 4,
    title: "Last Ember",
    year: 2023,
    genres: "Thriller, Action",
    duration: "1h 58m",
    rating: 4.6,
    poster: movie4,
    synopsis:
      "After a catastrophic wildfire decimates a small mountain town, a firefighter captain uncovers evidence that the blaze was deliberately set to cover up a massive conspiracy. With the arsonists closing in and time running out, she must protect the survivors while exposing the truth.",
    cast: ["Grace O'Brien", "Tomás Rivera", "Nina Blackwood", "Elias Frost"],
    director: "Sarah Thornton",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["9:00 AM", "12:00 PM", "3:30 PM", "7:00 PM"] },
      { date: "2026-02-21", times: ["10:00 AM", "1:00 PM", "4:30 PM", "8:00 PM"] },
      { date: "2026-02-22", times: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"] },
    ],
    ticketPrice: 240,
  },
  {
    id: 5,
    title: "Neon Shadows",
    year: 2024,
    genres: "Thriller, Noir",
    duration: "2h 1m",
    rating: 4.4,
    poster: movie5,
    synopsis:
      "In a rain-soaked metropolis where crime syndicates rule the night, a disgraced detective gets one last chance at redemption. When a series of murders mirrors an unsolved case from his past, he descends into the city's neon-lit underbelly, blurring the line between justice and obsession.",
    cast: ["Victor Kane", "Yuki Tanaka", "Isabelle Moreau", "Roland Kemp"],
    director: "Miguel Santos",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["11:00 AM", "2:30 PM", "6:30 PM", "10:00 PM"] },
      { date: "2026-02-21", times: ["12:00 PM", "3:30 PM", "7:30 PM"] },
      { date: "2026-02-22", times: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"] },
    ],
    ticketPrice: 270,
  },
  {
    id: 6,
    title: "Sky Adventure",
    year: 2024,
    genres: "Animation, Family",
    duration: "1h 42m",
    rating: 4.8,
    poster: movie6,
    synopsis:
      "When a young girl discovers a magical compass that reveals floating islands hidden above the clouds, she embarks on a breathtaking journey with her talking fox companion. Together they must save the sky kingdom from a storm sorcerer who threatens to bring the islands crashing to Earth.",
    cast: ["Lily Chen (voice)", "Tom Hardy (voice)", "Zendaya (voice)", "Oscar Isaac (voice)"],
    director: "Akiko Yamada",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
      { date: "2026-02-21", times: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"] },
      { date: "2026-02-22", times: ["10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM"] },
    ],
    ticketPrice: 200,
  },
  {
    id: 7,
    title: "The Haunting",
    year: 2023,
    genres: "Horror, Mystery",
    duration: "1h 55m",
    rating: 4.2,
    poster: movie7,
    synopsis:
      "A family moves into a centuries-old manor with a dark history, only to discover that the previous occupants never truly left. As terrifying visions and unexplainable events escalate, the mother must uncover the manor's blood-soaked secrets before her family becomes its newest permanent residents.",
    cast: ["Clara Westin", "James Blackford", "Aria Moon", "Sebastian Cole"],
    director: "Emily Cross",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["1:00 PM", "4:00 PM", "7:30 PM", "10:30 PM"] },
      { date: "2026-02-21", times: ["2:00 PM", "5:00 PM", "8:30 PM", "11:00 PM"] },
      { date: "2026-02-22", times: ["3:00 PM", "6:30 PM", "9:30 PM"] },
    ],
    ticketPrice: 230,
  },
  {
    id: 8,
    title: "Star Command",
    year: 2024,
    genres: "Sci-Fi, Action",
    duration: "2h 30m",
    rating: 4.9,
    poster: movie8,
    synopsis:
      "When an alien armada threatens to destroy Earth, the newly formed Star Command — an elite squadron of pilots from every nation — must venture beyond the solar system to strike at the enemy's home world. What they find there challenges everything they thought they knew about the universe and humanity's place in it.",
    cast: ["Commander Alex Drake", "Lieutenant Zara Obi", "Captain Finn Solaris", "Dr. Nova Kim"],
    director: "Christopher Nolan",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    showtimes: [
      { date: "2026-02-20", times: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"] },
      { date: "2026-02-21", times: ["9:00 AM", "12:30 PM", "4:00 PM", "7:30 PM", "11:00 PM"] },
      { date: "2026-02-22", times: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"] },
    ],
    ticketPrice: 300,
  },
];

export const upcomingMovies = [
  {
    id: 101,
    title: "Quantum Rift",
    year: 2026,
    genres: "Sci-Fi, Thriller",
    releaseDate: "March 15, 2026",
    poster: movie3,
    synopsis: "A physicist accidentally opens a portal to parallel dimensions, unleashing chaos across realities.",
  },
  {
    id: 102,
    title: "Emerald Kingdom",
    year: 2026,
    genres: "Fantasy, Adventure",
    releaseDate: "April 2, 2026",
    poster: movie6,
    synopsis: "An orphan discovers she is the rightful heir to a hidden emerald kingdom deep in the jungle.",
  },
  {
    id: 103,
    title: "Midnight Protocol",
    year: 2026,
    genres: "Action, Espionage",
    releaseDate: "April 20, 2026",
    poster: movie1,
    synopsis: "A disavowed spy must complete one final mission to clear her name and save millions.",
  },
  {
    id: 104,
    title: "Ocean's Fury",
    year: 2026,
    genres: "Adventure, Drama",
    releaseDate: "May 8, 2026",
    poster: movie4,
    synopsis: "Deep-sea explorers encounter a megalodon and a long-lost underwater civilization.",
  },
];

export const theatres = [
  { id: 1, name: "QuickShow Cinemas — Downtown", city: "Mumbai", address: "123 Marine Drive, Colaba", screens: 8, features: ["IMAX", "Dolby Atmos", "4DX"] },
  { id: 2, name: "QuickShow Cinemas — Bandra", city: "Mumbai", address: "Plot 45, Linking Road, Bandra West", screens: 6, features: ["Dolby Atmos", "Recliner Seats"] },
  { id: 3, name: "QuickShow Cinemas — Connaught Place", city: "Delhi", address: "Block C, CP Inner Circle", screens: 10, features: ["IMAX", "Dolby Atmos", "4DX", "Screening Lounge"] },
  { id: 4, name: "QuickShow Cinemas — Noida", city: "Delhi", address: "Sector 18, DLF Mall of India", screens: 7, features: ["Dolby Atmos", "Recliner Seats", "4DX"] },
  { id: 5, name: "QuickShow Cinemas — Koramangala", city: "Bangalore", address: "80 Feet Road, Koramangala 4th Block", screens: 5, features: ["Dolby Atmos", "Recliner Seats"] },
  { id: 6, name: "QuickShow Cinemas — Whitefield", city: "Bangalore", address: "Phoenix Marketcity, Whitefield", screens: 9, features: ["IMAX", "Dolby Atmos", "RPX"] },
  { id: 7, name: "QuickShow Cinemas — Anna Nagar", city: "Chennai", address: "VR Mall, Anna Nagar West", screens: 6, features: ["Dolby Atmos", "4DX"] },
  { id: 8, name: "QuickShow Cinemas — Salt Lake", city: "Kolkata", address: "City Centre, Salt Lake Sector V", screens: 5, features: ["Dolby Atmos", "Recliner Seats"] },
];
