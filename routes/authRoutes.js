import express from "express";
import { registerUser, loginUser, resendTfId } from "../controllers/authController.js";

import { forgotPassword, resetPassword, resendResetEmail } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/resendtfid", resendTfId);


router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.post("/resendResetEmail", resendResetEmail);

export default router;