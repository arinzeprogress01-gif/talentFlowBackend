import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    category: String,

    instructor: {
        type: String,
        default: "TalentFlow"
    },

    totalModules: {
        type: Number,
        default: 10
    },
    image: String

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
