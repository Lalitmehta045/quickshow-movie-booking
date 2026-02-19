import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await authAPI.getMe();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const { data } = await authAPI.login(credentials);
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const signup = async (credentials: any) => {
        try {
            const { data } = await authAPI.signup(credentials);
            setUser(data.user);
            toast.success("Account created successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Signup failed");
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
