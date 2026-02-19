const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const resetPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Reset Admin
        let admin = await User.findOne({ email: "admin@quickshow.com" });
        if (!admin) {
            console.log("Creating admin...");
            admin = new User({
                name: "Admin",
                email: "admin@quickshow.com",
                role: "admin"
            });
        }
        admin.password = "admin123";
        await admin.save();
        console.log("✅ Admin password reset to 'admin123'");

        // Verify Admin
        const verifyAdmin = await User.findOne({ email: "admin@quickshow.com" }).select("+password");
        const adminMatch = await verifyAdmin.comparePassword("admin123");
        console.log(`Admin verify: ${adminMatch}`);

        // Reset User
        let user = await User.findOne({ email: "user@quickshow.com" });
        if (!user) {
            console.log("Creating user...");
            user = new User({
                name: "Test User",
                email: "user@quickshow.com",
                role: "user"
            });
        }
        user.password = "user123";
        await user.save();
        console.log("✅ User password reset to 'user123'");

        // Verify User
        const verifyUser = await User.findOne({ email: "user@quickshow.com" }).select("+password");
        const userMatch = await verifyUser.comparePassword("user123");
        console.log(`User verify: ${userMatch}`);

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPasswords();
