import { useEffect, useState } from "react";
import { bookingsAPI } from "@/lib/api";
import { XCircle } from "lucide-react";

interface BookingData {
    _id: string;
    user: { name: string; email: string };
    movie: { title: string; poster: string };
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

const AdminBookings = () => {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await bookingsAPI.getAll();
                setBookings(res.data.bookings);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Cancel this booking?")) return;
        try {
            await bookingsAPI.cancel(id);
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBookings = bookings.filter((b) => {
        if (filter === "all") return true;
        return b.status === filter;
    });

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
                <h1 className="text-2xl font-bold">Bookings ({bookings.length})</h1>
                <div className="flex items-center gap-1 bg-secondary/60 rounded-full px-1 py-1">
                    {["all", "confirmed", "cancelled"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${filter === f ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Movie</th>
                                <th className="px-5 py-3 font-medium">Date & Time</th>
                                <th className="px-5 py-3 font-medium">Seats</th>
                                <th className="px-5 py-3 font-medium">Total</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="font-medium">{booking.user?.name || "N/A"}</p>
                                            <p className="text-xs text-muted-foreground">{booking.user?.email || ""}</p>
                                        </td>
                                        <td className="px-5 py-3 font-medium">{booking.movie?.title || "N/A"}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{booking.date} · {booking.time}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{booking.seats.join(", ")}</td>
                                        <td className="px-5 py-3 font-semibold">₹{booking.totalPrice}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${booking.status === "confirmed" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {booking.status === "confirmed" && (
                                                <button onClick={() => handleCancel(booking._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Cancel booking">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
