import express from "express";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

//import { seedCourses } from "./utils/seedCourses.js";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/progress", progressRoutes);

// Seed courses on server start
//await seedCourses();

app.use("/api/courses", courseRoutes);

app.get("/", (_req, res) => {
    res.send("TalentFlow API running...")
});

export default app;