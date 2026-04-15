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
            instructor: "Mr Oyinlade [Frontend Dev]",
            totalModules: 12
        },
        {
            title: "Backend Development",
            category: "Tech",
            instructor: "Mr Alpha [Backend Dev]",
            totalModules: 15
        },
        {
            title: "UI/UX Design",
            category: "Design",
            instructor: "Mr Damilare [UI/UX Designer]",
            totalModules: 10
        },
        {
            title: "Project Management",
            category: "Management",
            instructor: "Mrs Chika [Project Manager]",
            totalModules: 8
        },
        {
            title: "AI Integration",
            category: "AI",
            instructor: "Mr Charles Page [AI Specialist]",
            totalModules: 14
        },
        {
            title: "Machine Learning",
            category: "AI",
            instructor: "Dr. Sarah Johnson [ML Engineer]",
            totalModules: 16
        }
    ];

    await Course.insertMany(courses);

    console.log("All Courses Seeded Successfully! 🎉");
};