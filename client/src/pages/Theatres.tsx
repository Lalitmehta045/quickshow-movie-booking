import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { theatresAPI } from "@/lib/api";
import { MapPin, Film, Monitor } from "lucide-react";
import { useState } from "react";

const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];

const Theatres = () => {
    const [selectedCity, setSelectedCity] = useState("All");

    const { data, isLoading } = useQuery({
        queryKey: ["theatres", selectedCity],
        queryFn: async () => {
            const res = await theatresAPI.getAll(selectedCity !== "All" ? selectedCity : undefined);
            return res.data.theatres;
        },
    });

    const theatres = data || [];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Cinemas</h1>
                        <p className="text-muted-foreground">Experience movies in the best theatres near you</p>
                    </div>

                    <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg self-start">
                        {cities.map((city) => (
                            <button
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCity === city
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 bg-secondary/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {theatres.map((theatre: any) => (
                            <div key={theatre._id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{theatre.name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin className="w-3.5 h-3.5" /> {theatre.city}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                        <Film className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{theatre.address}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {theatre.features.map((feature: string) => (
                                        <span key={feature} className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium border border-border">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Monitor className="w-4 h-4 text-primary" /> {theatre.screens} Screens
                                    </span>
                                    <button className="text-sm font-semibold text-primary hover:underline">
                                        View Shows
                                    </button>
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

export default Theatres;
