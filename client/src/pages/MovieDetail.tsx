import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Star, Play, User, Info, ArrowLeft, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/lib/api";

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ["movie", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await moviesAPI.getById(id);
            return res.data.movie;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const movie = data;

    if (!movie) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
                <Link to="/movies" className="text-primary hover:underline">Back to movies</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Backdrop */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover blur-sm opacity-50 scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

                <div className="relative z-10 container mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
                    <div className="hidden md:block w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 relative group">
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        {movie.trailerUrl && (
                            <a
                                href={movie.trailerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center transform scale-0 group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                                </div>
                            </a>
                        )}
                    </div>

                    <div className="flex-1 mb-4">
                        <Link to="/movies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Movies
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {menuElements(movie.genres, (g: string) => (
                                <span key={g} className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                    {g}
                                </span>
                            ))}
                            {movie.isUpcoming && (
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                    UPCOMING
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{movie.title}</h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> {movie.year}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> {movie.duration}
                            </span>
                            <span className="flex items-center gap-2 font-semibold">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {movie.rating}/5
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {!movie.isUpcoming && (
                                <Link to={`/booking/${movie._id}`} className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1">
                                    <Ticket className="w-5 h-5" />
                                    Book Tickets
                                </Link>
                            )}
                            {movie.trailerUrl && (
                                <a
                                    href={movie.trailerUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-all"
                                >
                                    <Play className="w-4 h-4" /> Watch Trailer
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" /> Synopsis
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {movie.synopsis}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Cast & Crew
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {movie.director && (
                                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">DIR</div>
                                    <div>
                                        <p className="text-sm font-semibold">{movie.director}</p>
                                        <p className="text-xs text-muted-foreground">Director</p>
                                    </div>
                                </div>
                            )}
                            {movie.cast.map((actor: string) => (
                                <div key={actor} className="bg-card border border-border p-4 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{actor}</p>
                                        <p className="text-xs text-muted-foreground">Actor</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                        <h3 className="font-bold mb-4">Showtimes</h3>
                        {movie.showtimes.length > 0 ? (
                            <div className="space-y-4">
                                {movie.showtimes.map((session: any, idx: number) => (
                                    <div key={idx} className="border-b border-border pb-4 last:border-0 last:pb-0">
                                        <p className="text-sm font-medium mb-2 text-muted-foreground">
                                            {new Date(session.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {session.times.map((time: string) => (
                                                <div key={time} className="text-xs bg-secondary hover:bg-primary/20 hover:text-primary transition-colors px-3 py-1.5 rounded-md cursor-default">
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No showtimes available currently.</p>
                        )}

                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-muted-foreground">Ticket Price</span>
                                <span className="font-bold text-lg">₹{movie.ticketPrice}</span>
                            </div>
                            {!movie.isUpcoming && (
                                <Link to={`/booking/${movie._id}`} className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                    Book Now
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Helper for genre mapping because array mapping in JSX directly above was giving linter grief with 'any'
function menuElements<T>(list: T[], render: (item: T) => JSX.Element) {
    return list.map(render);
}

export default MovieDetail;
