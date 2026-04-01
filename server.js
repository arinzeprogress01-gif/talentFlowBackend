import app from "./app.js";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

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