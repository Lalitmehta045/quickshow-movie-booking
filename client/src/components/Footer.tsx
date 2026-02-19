import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16">
      <div className="px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-lg font-bold mb-3">
            <span className="text-primary">Q</span>uickShow
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
            Your ultimate destination for booking movie tickets online. Discover movies, pick your seats, and enjoy the show!
          </p>
          <div className="flex gap-2">
            <span className="bg-secondary text-foreground text-xs px-3 py-2 rounded-md font-medium">
              ▶ Google Play
            </span>
            <span className="bg-secondary text-foreground text-xs px-3 py-2 rounded-md font-medium">
              App Store
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/movies" className="hover:text-foreground transition-colors">Movies</Link></li>
            <li><Link to="/theatres" className="hover:text-foreground transition-colors">Theatres</Link></li>
            <li><Link to="/releases" className="hover:text-foreground transition-colors">Upcoming Releases</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>+91-9876-543-210</li>
            <li>support@quickshow.com</li>
            <li className="pt-4">
              <h4 className="font-semibold text-foreground mb-2">Account</h4>
              <Link to="/login" className="hover:text-foreground transition-colors block">Login / Sign up</Link>
              <Link to="/profile" className="hover:text-foreground transition-colors block mt-1">My Profile</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 md:px-12 py-4 text-center text-xs text-muted-foreground">
        Copyright 2026 © QuickShow. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
