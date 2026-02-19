import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/lib/api";
import MovieCard from "./MovieCard";

interface Movie {
  _id: string;
  title: string;
  poster: string;
  year: number;
  genres: string[];
  duration: string;
  rating: number;
  ticketPrice: number;
}

const NowShowing = () => {
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["now-showing"],
    queryFn: async () => {
      const res = await moviesAPI.getAll();
      return res.data.movies;
    },
  });

  const movies: Movie[] = data || [];
  const displayed = showAll ? movies : movies.slice(0, 4);

  if (isLoading) {
    return (
      <section className="px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Now Showing</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[2/3] bg-secondary/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Now Showing</h2>
        <Link
          to="/movies"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayed.map((movie) => (
          // Need to adapt MovieCard or just pass the movie prop if it matches structure
          // Since structure is similar but with _id, I need to check MovieCard
          <MovieCard key={movie._id} movie={{ ...movie, id: movie._id } as any} />
        ))}
      </div>

      {!showAll && movies.length > 4 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
};

export default NowShowing;
