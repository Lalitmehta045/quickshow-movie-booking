import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/lib/api";

const genres = ["All", "Action", "Adventure", "Sci-Fi", "Thriller", "Horror", "Drama", "Animation"];

const Movies = () => {
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");

    const { data, isLoading } = useQuery({
        queryKey: ["movies", search, selectedGenre],
        queryFn: async () => {
            const res = await moviesAPI.getAll({
                search: search || undefined,
                genre: selectedGenre !== "All" ? selectedGenre : undefined
            });
            return res.data.movies;
        },
    });

    const movies = data || [];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Explore Movies</h1>
                        <p className="text-muted-foreground">Discover the latest blockbusters and hidden gems</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-40 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="aspect-[2/3] bg-secondary/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {movies.map((movie: any) => (
                            <MovieCard key={movie._id} movie={{ ...movie, id: movie._id }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <h3 className="text-lg font-semibold mb-1">No movies found</h3>
                        <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearch(""); setSelectedGenre("All"); }}
                            className="mt-4 text-primary text-sm hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Movies;
