import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingContext";
import { User, Ticket, CalendarDays, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useAuth();
    const { getBookingsForUser } = useBookings();
    const navigate = useNavigate();

    const userBookings = user ? getBookingsForUser(user.email) : [];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-24 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
                {/* User Info */}
                <div className="bg-card border border-border rounded-2xl p-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-extrabold mb-1">{user?.name}</h1>
                            <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" /> Log Out
                        </button>
                        {user?.role === "admin" && (
                            <button
                                onClick={() => navigate("/admin")}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-medium text-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-card border border-border rounded-xl p-5 text-center">
                        <Ticket className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{userBookings.length}</p>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5 text-center">
                        <CalendarDays className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{userBookings.reduce((sum, b) => sum + b.seats.length, 0)}</p>
                        <p className="text-xs text-muted-foreground">Tickets Bought</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5 text-center">
                        <User className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">₹{userBookings.reduce((sum, b) => sum + b.totalPrice, 0)}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                </div>

                {/* Booking History */}
                <h2 className="text-2xl font-bold mb-6">Booking History</h2>
                {userBookings.length === 0 ? (
                    <div className="text-center py-16">
                        <Ticket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground mb-4">Start by exploring movies and booking your first ticket!</p>
                        <button onClick={() => navigate("/movies")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all">
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userBookings.map((booking) => (
                            <div key={booking.id} className="bg-card border border-border rounded-xl p-5 flex gap-4 hover:border-primary/20 transition-colors">
                                <img src={booking.moviePoster} alt={booking.movieTitle} className="w-16 h-24 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold truncate">{booking.movieTitle}</h3>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Confirmed</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                                        <span>{booking.date}</span>
                                        <span>{booking.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Seats: <span className="text-foreground font-medium">{booking.seats.join(", ")}</span></span>
                                        <span className="font-bold text-primary">₹{booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
