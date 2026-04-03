import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        fullName: {
            type: String,
            required: true,
            minlength: 4,
            maxLength: 50,
            match: [
                /^[a-zA-Z\s'-]+$/,
                "Name can only contain letters, spaces, hyphens and apostrophes"
            ]
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                "Please enter a valid email"
            ]


        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                "Password must be at least 8 characters with uppercase, lowercase and number"
            ]
        },

        role: {
            type: String,
            enum: ["learner", "tutor"],
            default: null,
        },

        tfId: {
            type: String,
            unique: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        learnerRef: String,

        tutorRef: String,

        selectedCourse: {
            type: String,
            default: null
        },

        isRoleVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,

        verificationExpire: Date,

        resetPasswordToken : String,
        
        resetPasswordExpire: Date
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;