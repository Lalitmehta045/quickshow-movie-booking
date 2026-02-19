import { useEffect, useState } from "react";
import { moviesAPI } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

interface MovieData {
    _id: string;
    title: string;
    year: number;
    genres: string[];
    duration: string;
    rating: number;
    poster: string;
    synopsis: string;
    cast: string[];
    director: string;
    ticketPrice: number;
    isUpcoming: boolean;
    isActive: boolean;
}

const emptyForm = {
    title: "",
    year: 2026,
    genres: "",
    duration: "",
    rating: 0,
    poster: "",
    synopsis: "",
    cast: "",
    director: "",
    ticketPrice: 250,
    isUpcoming: false,
};

const AdminMovies = () => {
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchMovies = async () => {
        try {
            const res = await moviesAPI.getAdminAll();
            setMovies(res.data.movies);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (movie: MovieData) => {
        setEditId(movie._id);
        setForm({
            title: movie.title,
            year: movie.year,
            genres: movie.genres.join(", "),
            duration: movie.duration,
            rating: movie.rating,
            poster: movie.poster,
            synopsis: movie.synopsis,
            cast: movie.cast.join(", "),
            director: movie.director,
            ticketPrice: movie.ticketPrice,
            isUpcoming: movie.isUpcoming,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                genres: form.genres.split(",").map((g: string) => g.trim()).filter(Boolean),
                cast: form.cast.split(",").map((c: string) => c.trim()).filter(Boolean),
            };
            if (editId) {
                await moviesAPI.update(editId, payload);
            } else {
                await moviesAPI.create(payload);
            }
            setShowModal(false);
            fetchMovies();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this movie?")) return;
        try {
            await moviesAPI.delete(id);
            setMovies((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Movies ({movies.length})</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Movie
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Movie</th>
                                <th className="px-5 py-3 font-medium">Year</th>
                                <th className="px-5 py-3 font-medium">Genres</th>
                                <th className="px-5 py-3 font-medium">Rating</th>
                                <th className="px-5 py-3 font-medium">Price</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                                            <span className="font-medium">{movie.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">{movie.year}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{movie.genres.join(", ")}</td>
                                    <td className="px-5 py-3">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {movie.rating}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-semibold">₹{movie.ticketPrice}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${movie.isUpcoming ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}>
                                            {movie.isUpcoming ? "Upcoming" : "Now Showing"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(movie)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(movie._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-semibold text-lg">{editId ? "Edit Movie" : "Add Movie"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <div className="grid grid-cols-2 gap-3">
                                <input value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} placeholder="Year" type="number" className="bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 2h 10m)" className="bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Genres (comma-separated)" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} placeholder="Director" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} placeholder="Cast (comma-separated)" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} placeholder="Synopsis" rows={3} className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                            <input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} placeholder="Poster URL" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <div className="grid grid-cols-2 gap-3">
                                <input value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} placeholder="Rating (0-5)" type="number" step="0.1" min="0" max="5" className="bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                                <input value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: Number(e.target.value) })} placeholder="Ticket Price (₹)" type="number" className="bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={form.isUpcoming} onChange={(e) => setForm({ ...form, isUpcoming: e.target.checked })} className="rounded border-border" />
                                Mark as Upcoming Release
                            </label>
                        </div>
                        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                                {saving ? "Saving..." : editId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMovies;
