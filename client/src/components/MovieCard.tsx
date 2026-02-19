import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "@/data/movies";

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden mb-3 aspect-[2/3] bg-secondary">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
            Buy Ticket
          </span>
        </div>
      </div>
      <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
        {movie.title}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        {movie.year} · {movie.genres} · {movie.duration}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary">₹{movie.ticketPrice}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          {movie.rating}
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
