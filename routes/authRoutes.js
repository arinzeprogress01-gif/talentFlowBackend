import express from "express";
import { registerUser, loginUser, resendTfId, verifyEmail, resendVerification} from "../controllers/authController.js";

import { forgotPassword, resetPassword, } from "../controllers/authController.js";

import { verifyRole } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { logoutUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);
 
router.post("/resendtfid", resendTfId);

router.get("/verify-email/:token", verifyEmail);

router.post("/resend-verification", resendVerification);


router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.put("/verify-role", protect, verifyRole);

router.get("/protected", protect, (req, res) => {
    res.json({ message: "You have accessed a protected route!", user: req.user });
});

router.post("/logout", verifyToken, logoutUser);

export default router;
export default router;
