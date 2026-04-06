import express from "express";
import {
    updateCourseProgress,
    getUserProgress
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/userProgress", protect, getUserProgress);
router.put("/update", protect, updateCourseProgress);

export default router;