import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTfId from "../utils/generateTfId.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import generateResetToken from "../utils/generateResetToken.js";
import crypto from "crypto"

export const registerUser = async (req, res) => {
        
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (!confirmPassword) {
            return res.status(400).json({ message: "Confirm password is required" });
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

        const verificationToken = crypto.randomBytes(20).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // Create user
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            tfId,
            verificationToken: hashedToken,
            verificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // 🔥 SEND EMAIL
        const verifyUrl = `http://localhost:8080/api/auth/verify-email/${verificationToken}`;

        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 25px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to TalentFlow 🚀</h1>
                    <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                        Powered by TrueMinds Ltd
                    </p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello <strong>${fullname}</strong>,</p>

                    <p style="font-size: 15px; color: #555; line-height: 1.6;">
                        We’re excited to have you join a growing community of individuals committed to learning, building, and becoming more.
                        Your journey toward mastering new skills and creating real impact starts here.
                    </p>

                    <!-- TF ID Box -->
                    <div style="margin: 25px 0; padding: 20px; background: #ecfdf5; border-left: 5px solid #047857; border-radius: 8px;">
                        <p style="margin: 0; font-size: 14px; color: #555;">Your TalentFlow ID</p>
                        <h2 style="margin: 5px 0 0; color: #065f46; letter-spacing: 1px;">
                            ${tfId}
                        </h2>
                    </div>

                    <p style="font-size: 15px; color: #555; line-height: 1.6;">
                        Keep this ID safe — it will be important as you progress, verify your profile, and access key features on your dashboard.
                    </p>

                    <p style="font-size: 15px; color: #555; line-height: 1.6;">
                        Stay consistent, stay curious, and keep building. TalentFlow is here to support your growth every step of the way.
                    </p>

                    <!-- ✅ EMAIL VERIFICATION -->
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 15px; color: #555;">
                            Please verify your email to activate your account.
                        </p>

                        <a href="${verifyUrl}" style="
                            display: inline-block;
                            margin-top: 10px;
                            padding: 12px 25px;
                            background: #047857;
                            color: white;
                            border-radius: 6px;
                            text-decoration: none;
                            font-size: 14px;
                            font-weight: bold;
                        ">
                            VERIFY MY EMAIL
                        </a>

                        <p style="margin-top: 10px; font-size: 12px; color: #888;">
                            This link will expire in 24 hours.
                        </p>
                    </div>

                    <!-- CTA -->
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="#" style="background: #065f46; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-size: 14px; display: inline-block;">
                            GET READY TO GROW
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} TrueMinds Ltd - TalentFlow</p>
                    <p style="margin: 5px 0 0;">Empowering growth through learning and collaboration</p>
                </div>
            </div>
        </div>
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

        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in"
            });
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
        <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">

            <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 20px; text-align: center; color: white;">
            <h2 style="margin:0;">Your TalentFlow ID</h2>
            </div>

            <div style="padding: 25px;">
            <p style="font-size:15px;">Hello <strong>${user.fullname}</strong>,</p>

            <p style="color:#555;">Here is your TalentFlow identification number:</p>

            <div style="margin:20px 0; padding:15px; background:#ecfdf5; border-left:4px solid #047857; border-radius:6px;">
                <h2 style="margin:0; color:#065f46; letter-spacing:1px;">${user.tfId}</h2>
            </div>

            <p style="color:#555;">Keep this safe — it will be used across your TalentFlow journey.</p>
            </div>

            <div style="text-align:center; font-size:12px; color:#888; padding:15px;">
            © ${new Date().getFullYear()} TrueMinds Ltd
            </div>

        </div>
        </div>
        `;

        await sendEmail(email, "Your TalentFlow ID", message);

        res.json({ message: "TF ID sent to email" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { resetToken, hashedToken } = generateResetToken();

        user.resetPassWordToken = hashedToken;
        user.resetPassWordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
            <h2>Reset Your Password</h2>
            <p>Hello ${user.fullname},</p>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to continue:</p>
            <a href="${resetUrl}" style="padding:10px 20px;background:#4f46e5;color:#fff;border-radius:5px;text-decoration:none;">
                Reset Password
            </a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn’t request this, ignore this email.</p>
        `;

        await sendEmail(email, "Password Reset", message);

        res.json({ message: "Reset email sent" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPassWordToken = undefined;
        user.resetPassWordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true; 
        user.verificationToken = undefined;
        user.verificationExpire = undefined;

        await user.save();

        res.send(`
            <h2>Email Verified Successfully ✅</h2>
            <p>You can now return to login.</p>
        `);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Already verified" });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");

        user.verificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const verifyUrl = `http://localhost:8080/verify-email/${verificationToken}`;

        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">

            <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 20px; text-align: center; color: white;">
            <h2 style="margin:0;">Verify Your Email</h2>
            </div>

            <div style="padding: 25px;">
            <p>Hello <strong>${user.fullname}</strong>,</p>

            <p style="color:#555;">
                Please verify your email to activate your TalentFlow account.
            </p>

            <div style="margin:20px 0; padding:15px; background:#ecfdf5; border-left:4px solid #047857; border-radius:6px;">
                <p style="margin:0; font-size:13px; color:#555;">Your TalentFlow ID</p>
                <h3 style="margin:5px 0 0; color:#065f46;">${user.tfId}</h3>
            </div>

            <div style="text-align:center; margin-top:20px;">
                <a href="${verifyUrl}" style="
                padding:12px 25px;
                background:#047857;
                color:white;
                border-radius:6px;
                text-decoration:none;
                font-weight:bold;
                ">
                Verify Email
                </a>
            </div>

            <p style="margin-top:15px; font-size:12px; color:#888;">
                This link will expire in 24 hours.
            </p>
            </div>

            <div style="text-align:center; font-size:12px; color:#888; padding:15px;">
            © ${new Date().getFullYear()} TrueMinds Ltd
            </div>

        </div>
        </div>
        `;

        await sendEmail(email, "Verify Your Email", message);

        res.json({ message: "Verification email resent" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};