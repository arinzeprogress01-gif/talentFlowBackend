import Course from "../models/Course.js";

export const seedCourses = async () => {
    const existing = await Course.countDocuments();

    if (existing > 0) {
        console.log("Courses already exist");
        return;
    }

    const courses = [
        {
            title: "Frontend Development",
            category: "Tech",
            instructor: "TalentFlow",
            totalModules: 12
        },
        {
            title: "Backend Development",
            category: "Tech",
            instructor: "TalentFlow",
            totalModules: 15
        },
        {
            title: "UI/UX Design",
            category: "Design",
            instructor: "TalentFlow",
            totalModules: 10
        },
        {
            title: "Project Management",
            category: "Management",
            instructor: "TalentFlow",
            totalModules: 8
        },
        {
            title: "AI Integration",
            category: "AI",
            instructor: "TalentFlow",
            totalModules: 14
        },
        {
            title: "Machine Learning",
            category: "AI",
            instructor: "TalentFlow",
            totalModules: 16
        }
    ];

    await Course.insertMany(courses);

    console.log("Courses seeded successfully");
};