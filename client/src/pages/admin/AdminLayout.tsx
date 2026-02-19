import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Film,
    Ticket,
    Users,
    Building2,
    LogOut,
    ArrowLeft,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Movies", to: "/admin/movies", icon: Film },
    { label: "Bookings", to: "/admin/bookings", icon: Ticket },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Theatres", to: "/admin/theatres", icon: Building2 },
];

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                            <span className="text-primary">Q</span>uickShow
                        </span>
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ADMIN
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            end={link.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`
                            }
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-border space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-secondary/50 transition-all w-full"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                {/* Top bar - mobile */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border lg:hidden px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-muted-foreground hover:text-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm">
                        <span className="text-primary">Q</span>uickShow Admin
                    </span>
                </header>

                <div className="p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
