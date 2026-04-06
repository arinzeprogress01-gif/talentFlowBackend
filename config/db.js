import mongoose from "mongoose";

import { seedCourses } from "../utils/seedCourses.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await seedCourses();
        
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;

//5DFTZB4F44Q57RCKCT1MV9UM