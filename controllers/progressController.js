import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import { getProgressMessage } from "../utils/progressHelper.js";


export const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const progress = await Progress.findOne({ user: userId });

        if (!progress) {
            return res.status(404).json({ message: "No Progress Found" });
        }

        const totalCourses = progress.courses.length;

        const completedCourses = progress.courses.filter(c => c.completed).length;

        const inProgress = totalCourses - completedCourses;

        const avgCompletion =
            totalCourses > 0
                ? progress.courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses
                : 0;

        // 🔥 ENCOURAGEMENT SYSTEM
        const getEncouragement = (percent) => {
            if (percent < 25) return "You're just getting started — stay consistent 💪";
            if (percent < 50) return "Good progress so far — keep pushing 🚀";
            if (percent < 75) return "You're doing great — halfway there 🔥";
            if (percent < 100) return "Almost done — don't stop now 🎯";
            return "Excellent work — course completed 🎉";
        };

        // 🔥 SORT MILESTONES (latest first)
        const sortedMilestones = progress.milestones.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.json({
            success: true,
            data: {
                overallStats: {
                    completionPercentage: Math.round(avgCompletion),
                    coursesCompleted: completedCourses,
                    inProgress,
                    totalCourses,
                    learningDays: progress.learningDays,
                    encouragement: getEncouragement(Math.round(avgCompletion))
                },
                courses: progress.courses,
                milestones: sortedMilestones
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateCourseProgress = async (req, res) => {
    try {
        const { courseName } = req.body;

        const progress = await Progress.findOne({ user: req.user.id });

        if (!progress) {
            return res.status(404).json({ message: "Progress Not Found" });
        }

        const course = progress.courses.find(c => c.title === courseName);

        if (!course) {
            return res.status(404).json({ message: "Course Not Found" });
        }

        // 🔥 Prevent overflow
        if (course.completed) {
            return res.json({ message: "Course Already Completed", course });
        }

        // 🔥 Increase module
        course.modulesCompleted += 1;

        // 🔥 Cap modules
        if (course.modulesCompleted > course.totalModules) {
            course.modulesCompleted = course.totalModules;
        }

        // 🔥 Calculate %
        course.progress = Math.round(
            (course.modulesCompleted / course.totalModules) * 100
        );

        // 🔥 Prevent >100
        if (course.progress > 100) course.progress = 100;

        // 🔥 GET MESSAGE
        const message = getProgressMessage(course.progress);

        // 🔥 PREVENT DUPLICATE MESSAGE
        const alreadyExists = progress.milestones.find(
            m => m.title === message && m.course === courseName
        );

        if (!alreadyExists) {
            progress.milestones.push({
                title: message,
                date: new Date().toLocaleDateString(),
                achieved: true,
                course: courseName
            });
        }

        // 🔥 ASSIGNMENTS (ONLY ONCE)
        const triggerMilestone = (title) => {
            const exists = progress.milestones.find(
                m => m.title === title && m.course === courseName
            );

            if (!exists) {
                progress.milestones.push({
                    title,
                    date: new Date().toLocaleDateString(),
                    achieved: true,
                    course: courseName
                });
            }
        };

        if (course.progress === 25) {
            triggerMilestone("Assignment 1 unlocked");
        }

        if (course.progress === 50) {
            triggerMilestone("Mid-course assignment unlocked");
        }

        if (course.progress === 75) {
            triggerMilestone("Advanced assignment unlocked");
        }

        if (course.progress === 100) {
            triggerMilestone("Final exam unlocked");
        }

        // 🔥 COURSE COMPLETION
        if (course.progress === 100 && !course.completed) {
            course.completed = true;

            triggerMilestone(`${courseName} Completed`);
        }

        // 🔥 LEARNING STREAK
        const today = new Date();
        const last = progress.lastActive || today;

        const diff = (today - last) / (1000 * 60 * 60 * 24);

        if (diff >= 1 && diff < 2) {
            progress.learningDays += 1;
        } else if (diff >= 2) {
            progress.learningDays = 1;
        }

        progress.lastActive = today;

        await progress.save();

        res.json({
            message: "Progress Updated Successfully",
            course
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER PROGRESS
export const getUserProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user.id });

        if (!progress) {
            return res.status(404).json({ message: "No Progress Found" });
        }

        res.json(progress);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const user = await User.findById(req.user.id);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course Not Found" });
        }

        let progress = await Progress.findOne({ user: user._id });

        if (!progress) {
            return res.status(404).json({ message: "Progress Not Found" });
        }

        // ❗ prevent duplicate
        const exists = progress.courses.find(
            c => c.title === course.title
        );

        if (exists) {
            return res.status(400).json({ message: "Already Enrolled!" });
        }

        // ✅ ADD NEW COURSE
        progress.courses.push({
            title: course.title,
            instructor: "TalentFlow Team",
            progress: 0,
            modulesCompleted: 0,
            totalModules: course.totalModules || 10,
            completed: false
        });

        // ✅ DYNAMIC MILESTONE
        progress.milestones.push({
            title: `Enrolled in another course: ${course.title}`,
            date: new Date().toLocaleDateString(),
            achieved: true
        });

        await progress.save();

        res.json({ message: "Course Enrolled Successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
