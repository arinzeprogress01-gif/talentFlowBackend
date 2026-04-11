import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            data: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isVerified,
                isRoleVerified: user.isRoleVerified,
                selectedCourse: user.selectedCourse,
                learnerRef: user.learnerRef,
                tutorRef: user.tutorRef
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};