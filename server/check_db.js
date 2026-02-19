const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const admin = await User.findOne({ email: "admin@quickshow.com" }).select("+password");
        if (admin) {
            console.log("Admin found.");
            const isMatch = await admin.comparePassword("admin123");
            console.log(`Password 'admin123' match: ${isMatch}`);

            // Also test manual compare
            const manualMatch = await bcrypt.compare("admin123", admin.password);
            console.log(`Manual bcrypt compare: ${manualMatch}`);
        } else {
            console.log("Admin NOT found");
        }

        const user = await User.findOne({ email: "user@quickshow.com" }).select("+password");
        if (user) {
            const isMatch = await user.comparePassword("user123");
            console.log(`User 'user123' match: ${isMatch}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
