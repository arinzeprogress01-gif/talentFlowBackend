import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTfId from "../utils/generateTfId.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate TF ID
        const tfId = generateTfId();

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            tfId,
        });

        res.status(201).json({
            message: "User registered successfully",
            tfId: user.tfId,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};