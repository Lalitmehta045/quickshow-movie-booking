import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/lib/api";
import { Calendar, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Releases = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["upcoming-movies"],
        queryFn: async () => {
            const res = await moviesAPI.getAll({ upcoming: "true" });
            return res.data.movies;
        },
    });

    const movies = data || [];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Upcoming Releases</h1>
                        <p className="text-muted-foreground">Get ready for the next big blockbusters</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[2/3] bg-secondary/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {movies.map((movie: any) => (
                            <div key={movie._id} className="group relative">
                                <Link to={`/movies/${movie._id}`} className="block relative aspect-[2/3] rounded-xl overflow-hidden mb-4 bg-secondary">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                            View Details
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                        {new Date(movie.year, 0, 1).getFullYear()} {/* Just showing year if specific date missing, but seeded data should have it */}
                                    </div>
                                </Link>

                                <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                                    {movie.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">{movie.genres.join(", ")}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                        <Calendar className="w-4 h-4" />
                                        Coming Soon
                                    </div>
                                    <button className="text-xs font-semibold bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                                        <Bell className="w-3 h-3" /> Notify Me
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <h3 className="text-lg font-semibold mb-1">No upcoming movies found</h3>
                        <p className="text-muted-foreground text-sm">Check back later for new releases!</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Releases;
