import express from "express";
import { registerUser, loginUser, resendTfId } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/resendtfid", resendTfId);

export default router;