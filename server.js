import dotenv from "dotenv";

import app from "./app.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

if (typeof process.env.PORT !== "undefined") {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} else {
    const PORT = 8080;
    app.listen(PORT, () => {
        console,log(`Server running on port ${PORT}`);
    });
}