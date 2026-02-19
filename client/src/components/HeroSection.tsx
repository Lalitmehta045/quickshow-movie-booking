import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "../assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background">
      {/* Static Hero Banner Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})`, backgroundPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center justify-center text-center h-full">

        {/* Static Text Content */}
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Unlimited Movies,<br />
            <span className="text-primary">TV Shows, & More.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200/90 leading-relaxed max-w-2xl">
            Experience the magic of cinema with QuickShow. Book your tickets now and enjoy the latest blockbusters.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/movies"
              className="group relative inline-flex items-center gap-3 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] active:scale-95"
            >
              Book Tickets
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm border border-white/10 transition-all hover:border-white/20 active:scale-95"
            >
              Explore Movies
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
