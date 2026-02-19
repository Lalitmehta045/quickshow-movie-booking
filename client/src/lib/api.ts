import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Auth
export const authAPI = {
    signup: (data: { name: string; email: string; password: string }) =>
        api.post("/auth/signup", data),
    login: (data: { email: string; password: string }) =>
        api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
};

// Movies
export const moviesAPI = {
    getAll: (params?: { search?: string; genre?: string; upcoming?: string }) =>
        api.get("/movies", { params }),
    getById: (id: string) => api.get(`/movies/${id}`),
    create: (data: any) => api.post("/movies", data),
    update: (id: string, data: any) => api.put(`/movies/${id}`, data),
    delete: (id: string) => api.delete(`/movies/${id}`),
    getAdminAll: () => api.get("/movies/all"),
};

// Bookings
export const bookingsAPI = {
    getAll: () => api.get("/bookings"),
    create: (data: { movieId: string; date: string; time: string; seats: string[] }) =>
        api.post("/bookings", data),
    cancel: (id: string) => api.put(`/bookings/${id}/cancel`),
    getBookedSeats: (movieId: string, date: string, time: string) =>
        api.get("/bookings/booked-seats", { params: { movieId, date, time } }),
};

// Users
export const usersAPI = {
    getAll: () => api.get("/users"),
    update: (id: string, data: { name?: string; email?: string }) =>
        api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Theatres
export const theatresAPI = {
    getAll: (city?: string) => api.get("/theatres", { params: city ? { city } : {} }),
    create: (data: any) => api.post("/theatres", data),
    update: (id: string, data: any) => api.put(`/theatres/${id}`, data),
    delete: (id: string) => api.delete(`/theatres/${id}`),
};

// Stats
export const statsAPI = {
    getDashboard: () => api.get("/stats"),
};

export default api;
