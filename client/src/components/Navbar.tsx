import { Search, Menu, X, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Theatres", to: "/theatres" },
  { label: "Releases", to: "/releases" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent">
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="text-primary">Q</span>uickShow
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-full px-1 py-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl shadow-background/50 py-1 animate-fade-in-up">
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary/50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Log In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-card border-l border-border shadow-2xl p-6 pt-20 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {isAuthenticated ? (
              <div className="mt-6 pt-6 border-t border-border space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-secondary/50 transition-all w-full"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 text-center rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
