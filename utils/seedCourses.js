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
            totalModules: 12,
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
        },
        {
            title: "Backend Development",
            category: "Tech",
            instructor: "Mr Alpha [Backend Dev]",
            totalModules: 15,
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
        },
        {
            title: "UI/UX Design",
            category: "Design",
            instructor: "Mr Damilare [UI/UX Designer]",
            totalModules: 10,
            image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e"
        },
        {
            title: "Project Management",
            category: "Management",
            instructor: "Mrs Chika [Project Manager]",
            totalModules: 8,
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
        },
        {
            title: "AI Integration",
            category: "AI",
            instructor: "Mr Charles Page [AI Specialist]",
            totalModules: 14,
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
        },
        {
            title: "Machine Learning",
            category: "AI",
            instructor: "Dr. Sarah Johnson [ML Engineer]",
            totalModules: 16,
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
        }
    ];

    await Course.insertMany(courses);

    console.log("All Courses Seeded Successfully And Database Updated! 🎉");
};
