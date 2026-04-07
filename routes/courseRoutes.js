import express from "express";
import Course from "../models/Course.js";
import { enrollCourse } from "../controllers/progressController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL COURSES
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/enroll", protect, enrollCourse);


export default router;