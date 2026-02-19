const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        date: {
            type: String,
            required: [true, "Date is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
        },
        seats: {
            type: [String],
            required: [true, "At least one seat is required"],
            validate: [(val) => val.length > 0, "At least one seat is required"],
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
