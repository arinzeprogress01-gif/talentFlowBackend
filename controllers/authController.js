import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTfId from "../utils/generateTfId.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";

export const registerUser = async (req, res) => {
        
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

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
            fullname,
            email,
            password: hashedPassword,
            tfId,
        });

        // 🔥 SEND EMAIL
        const message = `
            <h2>Welcome to TalentFlow 🚀</h2>
            <p>Hello ${fullname},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Your TalentFlow ID:</strong> ${tfId}</p>
            <p>Keep this ID safe for verification and tracking.</p>
        `;

        sendEmail(email, "Welcome to TalentFlow", message)
            .catch(err => console.error("Email failed:", err.message));
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
                fullname: user.fullname,
                email: user.email,
                tfId: user.tfId,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resendTfId = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const message = `
            <h2>Your TalentFlow ID</h2>
            <p>Hello ${user.name},</p>
            <p>Your TF ID is: <strong>${user.tfId}</strong></p>
        `;

        await sendEmail(email, "Your TalentFlow ID", message);

        res.json({ message: "TF ID sent to email" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};