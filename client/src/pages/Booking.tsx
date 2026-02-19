import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moviesAPI, bookingsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingContext";
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 8;

const Booking = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addBooking } = useBookings();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch movie details
    const { data: movie, isLoading: movieLoading } = useQuery({
        queryKey: ["movie", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await moviesAPI.getById(id);
            return res.data.movie;
        },
        enabled: !!id,
    });

    // Set default date/time when movie loads
    useEffect(() => {
        if (movie && movie.showtimes?.length > 0) {
            if (!date) setDate(movie.showtimes[0].date);
            if (!time) setTime(movie.showtimes[0].times[0]);
        }
    }, [movie]);

    // Fetch booked seats
    const { data: bookedSeats = [] } = useQuery({
        queryKey: ["booked-seats", id, date, time],
        queryFn: async () => {
            if (!id || !date || !time) return [];
            const res = await bookingsAPI.getBookedSeats(id, date, time);
            return res.data.bookedSeats;
        },
        enabled: !!id && !!date && !!time,
    });

    if (movieLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!movie) return null;

    const handleSeatClick = (seatId: string) => {
        if (bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
        } else {
            if (selectedSeats.length >= 6) {
                toast.error("You can only select up to 6 seats");
                return;
            }
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (!date || !time || selectedSeats.length === 0) {
            toast.error("Please select date, time and seats");
            return;
        }

        setIsSubmitting(true);
        try {
            await addBooking({
                movieId: movie._id,
                date,
                time,
                seats: selectedSeats,
            });
            navigate("/profile");
        } catch (error) {
            // Error handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPrice = selectedSeats.length * movie.ticketPrice;

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar Summary */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-card border-r border-border p-6 flex flex-col h-auto md:h-screen md:fixed left-0 top-0 overflow-y-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-6">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-32 rounded-lg shadow-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold leading-tight mb-2">{movie.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        {movie.genres.join(", ")} | {movie.duration}
                    </p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Theatre</h3>
                        <p className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-primary" /> QuickShow Cinemas
                        </p>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Date & Time</h3>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-primary" />
                                {date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Select Date"}
                            </p>
                            <p className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4 text-primary" /> {time || "Select Time"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Seats</h3>
                        <p className="text-sm font-medium">
                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
                        </p>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4 text-sm">
                        <span className="text-muted-foreground">Price per ticket</span>
                        <span>₹{movie.ticketPrice}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-xl font-bold">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button
                        onClick={handleBooking}
                        disabled={isSubmitting || selectedSeats.length === 0}
                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                    >
                        {isSubmitting ? "Bookings..." : "Confirm Booking"}
                    </button>
                </div>
            </div>

            {/* Main Selection Area */}
            <div className="flex-1 md:ml-[33.333333%] lg:ml-[25%] p-6 md:p-12 pb-32">
                <h1 className="text-2xl font-bold mb-8">Select Seats</h1>

                {/* Date Selection */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Date</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {movie.showtimes.map((s: any) => (
                            <button
                                key={s.date}
                                onClick={() => { setDate(s.date); setTime(""); }}
                                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl border transition-all ${date === s.date
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-card border-border hover:border-primary/50"
                                    }`}
                            >
                                <span className="text-xs font-medium uppercase">{new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                <span className="text-lg font-bold">{new Date(s.date).getDate()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                {date && (
                    <div className="mb-12">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Time</h3>
                        <div className="flex flex-wrap gap-3">
                            {movie.showtimes
                                .find((s: any) => s.date === date)
                                ?.times.map((t: string) => (
                                    <button
                                        key={t}
                                        onClick={() => setTime(t)}
                                        className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all ${time === t
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-card border-border hover:border-primary/50"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Screen */}
                <div className="mb-12">
                    <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-1" />
                    <div className="h-8 bg-gradient-to-b from-primary/10 to-transparent transform perspective-[500px] rotateX-[-30deg] origin-top mb-8" />
                    <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">Screen</p>
                </div>

                {/* Seat Grid */}
                <div className="flex justify-center mb-12 overflow-x-auto">
                    <div className="grid gap-x-2 gap-y-2">
                        {rows.map((row) => (
                            <div key={row} className="flex gap-2 items-center">
                                <span className="w-6 text-center text-xs text-muted-foreground font-medium">{row}</span>
                                {Array.from({ length: seatsPerRow }).map((_, i) => {
                                    const seatId = `${row}${i + 1}`;
                                    const isBooked = bookedSeats.includes(seatId);
                                    const isSelected = selectedSeats.includes(seatId);

                                    return (
                                        <button
                                            key={seatId}
                                            disabled={isBooked}
                                            onClick={() => handleSeatClick(seatId)}
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-md text-[10px] md:text-xs font-medium transition-all flex items-center justify-center ${isBooked
                                                    ? "bg-secondary/40 text-muted-foreground/30 cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(225,29,72,0.5)] transform scale-105"
                                                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-secondary" /> Available
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary" /> Selected
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-secondary/40" /> Booked
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
