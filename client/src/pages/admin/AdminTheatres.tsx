import { useEffect, useState } from "react";
import { theatresAPI } from "@/lib/api";
import { Plus, Pencil, Trash2, X, MapPin } from "lucide-react";

interface TheatreData {
    _id: string;
    name: string;
    city: string;
    address: string;
    screens: number;
    features: string[];
}

const emptyForm = { name: "", city: "", address: "", screens: 1, features: "" };

const AdminTheatres = () => {
    const [theatres, setTheatres] = useState<TheatreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchTheatres = async () => {
        try {
            const res = await theatresAPI.getAll();
            setTheatres(res.data.theatres);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheatres();
    }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (theatre: TheatreData) => {
        setEditId(theatre._id);
        setForm({
            name: theatre.name,
            city: theatre.city,
            address: theatre.address,
            screens: theatre.screens,
            features: theatre.features.join(", "),
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
            };
            if (editId) {
                await theatresAPI.update(editId, payload);
            } else {
                await theatresAPI.create(payload);
            }
            setShowModal(false);
            fetchTheatres();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this theatre?")) return;
        try {
            await theatresAPI.delete(id);
            setTheatres((prev) => prev.filter((t) => t._id !== id));
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
                <h1 className="text-2xl font-bold">Theatres ({theatres.length})</h1>
                <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" /> Add Theatre
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Name</th>
                                <th className="px-5 py-3 font-medium">City</th>
                                <th className="px-5 py-3 font-medium">Address</th>
                                <th className="px-5 py-3 font-medium">Screens</th>
                                <th className="px-5 py-3 font-medium">Features</th>
                                <th className="px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theatres.map((theatre) => (
                                <tr key={theatre._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                    <td className="px-5 py-3 font-medium">{theatre.name}</td>
                                    <td className="px-5 py-3">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <MapPin className="w-3 h-3" /> {theatre.city}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{theatre.address}</td>
                                    <td className="px-5 py-3 text-center">{theatre.screens}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {theatre.features.map((f) => (
                                                <span key={f} className="bg-secondary text-xs px-2 py-0.5 rounded-full">{f}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(theatre)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(theatre._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
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
                    <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-semibold text-lg">{editId ? "Edit Theatre" : "Add Theatre"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Theatre Name" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.screens} onChange={(e) => setForm({ ...form, screens: Number(e.target.value) })} placeholder="Number of Screens" type="number" min="1" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (comma-separated, e.g. IMAX, Dolby Atmos)" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
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

export default AdminTheatres;
