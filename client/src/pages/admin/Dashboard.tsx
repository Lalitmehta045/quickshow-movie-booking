import { useEffect, useState } from "react";
import { statsAPI } from "@/lib/api";
import { Film, Ticket, Users, DollarSign, TrendingUp, XCircle } from "lucide-react";

interface Stats {
    totalUsers: number;
    totalMovies: number;
    totalBookings: number;
    totalRevenue: number;
    confirmedBookings: number;
    cancelledBookings: number;
}

interface RecentBooking {
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

const Dashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await statsAPI.getDashboard();
                setStats(res.data.stats);
                setRecentBookings(res.data.recentBookings);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Movies", value: stats?.totalMovies || 0, icon: Film, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Ticket, color: "text-green-400", bg: "bg-green-400/10" },
        { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Confirmed", value: stats?.confirmedBookings || 0, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Cancelled", value: stats?.cancelledBookings || 0, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                        <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-semibold">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Movie</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Seats</th>
                                <th className="px-5 py-3 font-medium">Price</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                                        No bookings yet
                                    </td>
                                </tr>
                            ) : (
                                recentBookings.map((booking) => (
                                    <tr key={booking._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="font-medium">{booking.user?.name || "N/A"}</p>
                                            <p className="text-xs text-muted-foreground">{booking.user?.email || ""}</p>
                                        </td>
                                        <td className="px-5 py-3 font-medium">{booking.movie?.title || "N/A"}</td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            {booking.date} · {booking.time}
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">{booking.seats.join(", ")}</td>
                                        <td className="px-5 py-3 font-semibold">₹{booking.totalPrice}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${booking.status === "confirmed"
                                                        ? "bg-green-500/10 text-green-400"
                                                        : "bg-red-500/10 text-red-400"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
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

export default Dashboard;
