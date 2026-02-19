import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { moviesAPI } from "@/lib/api";
import { Search, X, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    const { data } = useQuery({
        queryKey: ["search", query],
        queryFn: async () => {
            if (!query.trim()) return [];
            const res = await moviesAPI.getAll({ search: query });
            return res.data.movies;
        },
        enabled: query.trim().length > 1,
    });

    const results = data || [];

    if (!isOpen) return null;

    const handleSelect = (id: string) => {
        onClose();
        navigate(`/movies/${id}`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl shadow-background/50 overflow-hidden animate-fade-in-up">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies, genres, directors..."
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                    />
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {query.trim() && results.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            <p className="text-sm">No results found for "<span className="text-foreground font-medium">{query}</span>"</p>
                        </div>
                    )}

                    {results.map((movie: any) => (
                        <button
                            key={movie._id}
                            onClick={() => handleSelect(movie._id)}
                            className="w-full flex items-center gap-4 px-5 py-3 hover:bg-secondary/50 transition-colors text-left"
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{movie.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {movie.year} · {movie.genres.join(", ")}
                                </p>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {movie.rating}
                            </span>
                        </button>
                    ))}

                    {!query.trim() && (
                        <div className="py-8 text-center text-muted-foreground">
                            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Start typing to search movies</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
