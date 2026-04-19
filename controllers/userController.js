import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User Profile Not Found" });
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
                referenceNumber: user.role === "learner"
                    ? user.learnerRef
                    : user.tutorRef,

               //  ADD THIS
                joinedAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
