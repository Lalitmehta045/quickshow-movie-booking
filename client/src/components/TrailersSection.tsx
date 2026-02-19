import { Play } from "lucide-react";
import trailerMain from "@/assets/trailer-main.jpg";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import { useState } from "react";

const thumbnails = [movie1, movie2, movie3, movie4, movie5, movie6];

const TrailersSection = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="px-6 md:px-12 py-16">
      <h2 className="text-2xl font-bold mb-8">Trailers</h2>

      <div className="relative rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto mb-6 bg-secondary">
        <img
          src={trailerMain}
          alt="Movie trailer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm border border-foreground/30 flex items-center justify-center hover:bg-foreground/30 transition-colors">
            <Play className="w-7 h-7 fill-foreground text-foreground ml-1" />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        {thumbnails.map((thumb, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative w-20 h-14 rounded-lg overflow-hidden transition-all ${
              selected === i
                ? "ring-2 ring-primary scale-105"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={thumb}
              alt={`Trailer ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-4 h-4 fill-foreground/80 text-foreground/80" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrailersSection;
