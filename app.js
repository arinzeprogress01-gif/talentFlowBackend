import express from "express";

import authRoutes from "./routes/authRoutes.js";

import progressRoutes from "./routes/progressRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/progress", progressRoutes);

app.get("/", (_req, res) => {
    res.send("TalentFlow API running...")
});

export default app;