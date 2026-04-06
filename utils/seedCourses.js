import Course from "../models/Course.js";

export const seedCourses = async () => {
    const existing = await Course.countDocuments();//countDocuments is used to count the number of documents in the collection that match the specified query. If no query is provided, it counts all documents in the collection.

    if (existing > 0) {
        console.log("Courses already exist");
        return;
    }

    const courses = [
        { title: "Frontend Development", category: "Tech" },
        { title: "Backend Development", category: "Tech" },
        { title: "UI/UX Design", category: "Design" },
        { title: "Project Management", category: "Management" },
        { title: "AI Integration", category: "AI" },
        { title: "Machine Learning", category: "AI" }
    ];

    await Course.insertMany(courses); //insertMany is used to insert multiple documents into the collection at once

    console.log("Courses seeded successfully");
};