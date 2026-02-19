const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Theatre name is required"],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        screens: {
            type: Number,
            required: true,
            default: 1,
        },
        features: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Theatre", theatreSchema);
