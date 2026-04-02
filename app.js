import express from "express";

import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
    res.send("TalentFlow API running...")
});

export default app;