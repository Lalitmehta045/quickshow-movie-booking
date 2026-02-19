import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import { Trash2, Shield, User } from "lucide-react";

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await usersAPI.getAll();
                setUsers(res.data.users);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        try {
            await usersAPI.delete(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Users ({users.length})</h1>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Name</th>
                                <th className="px-5 py-3 font-medium">Email</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xs font-bold text-primary-foreground">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${user.role === "admin"
                                                ? "bg-yellow-500/10 text-yellow-400"
                                                : "bg-blue-500/10 text-blue-400"
                                            }`}>
                                            {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
