import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    instructor: String,

    progress: {
        type: Number,
        default: 0
    },

    modulesCompleted: {
        type: Number,
        default: 0
    },

    totalModules: {
        type: Number,
        default: 1
    },

    completed: {
        type: Boolean,
        default: false
    }
});

const milestoneSchema = new mongoose.Schema({
    title: String,
    date: String,
    course: String,
    achieved: {
        type: Boolean,
        default: false
    }
});

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    courses: [courseProgressSchema],

    milestones: [milestoneSchema],

    lastActive : {
        type : Date,
        default : Date.now
    },

    learningDays: {
        type: Number,
        default: 1
    }

}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);