import { createContext, useContext, ReactNode } from "react";
import { bookingsAPI } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BookingContextType {
    bookings: any[];
    addBooking: (booking: any) => Promise<any>;
    getBookingsForUser: (email: string) => any[];
    loading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            try {
                const res = await bookingsAPI.getAll();
                return res.data.bookings;
            } catch (error) {
                return [];
            }
        },
        refetchOnWindowFocus: false,
        retry: false,
    });

    const bookingMutation = useMutation({
        mutationFn: (newBooking: any) => bookingsAPI.create(newBooking),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Booking confirmed!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Booking failed");
            throw error;
        },
    });

    const addBooking = async (booking: any) => {
        const result = await bookingMutation.mutateAsync(booking);
        return result.data.booking;
    };

    const getBookingsForUser = (email: string) => {
        return data?.filter((b: any) => b.user?.email === email) || [];
    };

    return (
        <BookingContext.Provider
            value={{
                bookings: data || [],
                addBooking,
                getBookingsForUser,
                loading: isLoading,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBookings must be used within a BookingProvider");
    }
    return context;
};
