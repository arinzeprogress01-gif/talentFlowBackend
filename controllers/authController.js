import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTfId from "../utils/generateTfId.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";

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
        // Generate TF ID
        const tfId = generateTfId();

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            tfId,
        });

        // 🔥 SEND EMAIL
        const message = `
            <h2>Welcome to TalentFlow 🚀</h2>
            <p>Hello ${name},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Your TalentFlow ID:</strong> ${tfId}</p>
            <p>Keep this ID safe for verification and tracking.</p>
        `;

        await sendEmail(email, "Welcome to TalentFlow", message);
        res.status(201).json({
            message: "User registered successfully",
            tfId: user.tfId,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                tfId: user.tfId,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};