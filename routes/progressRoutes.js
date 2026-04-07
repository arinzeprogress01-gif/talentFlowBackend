import express from "express";
import {
    updateCourseProgress,
    getUserProgress, getProgress
} from "../controllers/progressController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/userProgress", protect, getUserProgress);

router.put("/update", protect, updateCourseProgress);

router.get("/", protect, getProgress);

export default router;