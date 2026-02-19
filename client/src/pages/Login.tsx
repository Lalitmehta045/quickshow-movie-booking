import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Film, ArrowLeft } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

    const validate = () => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
        if (!password) errs.password = "Password is required";
        else if (password.length < 6) errs.password = "Password must be at least 6 characters";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const success = login({ email, password });
        if (success) navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/30">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
                <div className="relative z-10 text-center px-12">
                    <Film className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h2 className="text-4xl font-extrabold mb-4">
                        <span className="text-primary">Q</span>uickShow
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                        Your gateway to the best cinema experience. Book tickets, discover new movies, and never miss a show.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to home
                    </button>

                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <Film className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold"><span className="text-primary">Q</span>uickShow</span>
                    </div>

                    <h1 className="text-3xl font-extrabold mb-2">Welcome back</h1>
                    <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                        </div>

                        <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]">
                            Sign In
                        </button>
                    </form>

                    <p className="text-sm text-muted-foreground text-center mt-8">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
