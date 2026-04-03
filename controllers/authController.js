import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTfId from "../utils/generateTfId.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import crypto from "crypto"
import generateRoleId from "../utils/generateRoleId.js";

export const registerUser = async (req, res) => {
        
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
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
            fullName,
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
                    <p style="font-size: 16px; color: #333;">Hello <strong>${fullName}</strong>,</p>

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
                fullName: user.fullName,
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
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 25px; text-align: center; color: white;">
                    <h1 style="margin: 0;">Your TalentFlow ID</h1>
                    <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                        Powered by TrueMinds Ltd
                    </p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hello <strong>${user.fullName}</strong>,</p>

                    <p style="color:#555; line-height:1.6;">
                        As requested, here is your official TalentFlow Identification Number. This ID is unique to you and serves as your identity across the TalentFlow ecosystem.
                    </p>

                    <div style="margin: 25px 0; padding: 20px; background: #ecfdf5; border-left: 5px solid #047857; border-radius: 8px;">
                        <p style="margin:0; font-size:14px; color:#555;">Your TalentFlow ID</p>
                        <h2 style="margin:5px 0 0; color:#065f46;">
                            ${user.tfId}
                        </h2>
                    </div>

                    <p style="color:#555; line-height:1.6;">
                        Keep this ID safe — it will be required for verification, onboarding, and tracking your progress throughout your journey.
                    </p>

                    <p style="color:#555;">
                        If you did not request this, please ignore this message.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                    © ${new Date().getFullYear()} TrueMinds Ltd - TalentFlow
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



// --------------------
// FORGOT PASSWORD
// --------------------
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1️⃣ Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // 3️⃣ Save hashed token and expiry to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // 4️⃣ Build reset URL (use client URL from env)
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // 5️⃣ Create beautiful emerald green email
        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 25px; text-align: center; color: white;">
                    <h1 style="margin: 0;">Password Reset Request</h1>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p>Hello <strong>${user.fullName}</strong>,</p>

                    <p style="color:#555; line-height:1.6;">
                        We received a request to reset your TalentFlow account password. If this was you, click the button below to securely create a new password.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                        <a href="${resetUrl}" style="
                            background:#047857;
                            color:white;
                            padding:14px 28px;
                            text-decoration:none;
                            border-radius:6px;
                            font-weight:bold;
                        ">
                            RESET PASSWORD
                        </a>
                    </div>

                    <p style="color:#555;">
                        This link will expire in <strong>24 hours</strong> for security reasons.
                    </p>

                    <p style="color:#999;">
                        If you did not request this, please ignore this email. Your account remains secure.
                    </p>
                </div>

                <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                    TrueMinds Ltd • TalentFlow Security
                </div>
            </div>
        </div>
        `;

        // 6️⃣ Send email
        await sendEmail(email, "TalentFlow Password Reset", message);

        res.json({ message: "Reset email sent" });
        console.log(`Password reset email sent to ${email} with token: ${resetToken}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --------------------
// RESET PASSWORD
// --------------------
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // 1️⃣ Hash the token to match DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // 2️⃣ Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // 3️⃣ Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

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
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 25px; text-align: center; color: white;">
                    <h1>Email Verification Required</h1>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p>Hello <strong>${user.fullName}</strong>,</p>

                    <p style="color:#555; line-height:1.6;">
                        You're one step away from activating your TalentFlow account. Please confirm your email address to unlock full access to the platform.
                    </p>

                    <div style="margin:20px 0; padding:15px; background:#ecfdf5; border-left:5px solid #047857;">
                        <strong>Your ID:</strong> ${user.tfId}
                    </div>

                    <div style="text-align:center; margin-top:25px;">
                        <a href="${verifyUrl}" style="
                            background:#047857;
                            color:white;
                            padding:12px 25px;
                            border-radius:6px;
                            text-decoration:none;
                            font-weight:bold;
                        ">
                            VERIFY MY EMAIL
                        </a>
                    </div>

                    <p style="margin-top:15px; font-size:12px; color:#999;">
                        This verification link expires in 24 hours.
                    </p>
                </div>

                <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                    TalentFlow • TrueMinds Ltd
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


export const selectRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["learner", "tutor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== null) {
            return res.status(400).json({ message: "Role already selected" });
        }

        user.role = role;

        let refId;

        if (role === "learner") {
            refId = generateRoleId("LRN");
            user.learnerRef = refId;
        } else {
            refId = generateRoleId("TRN");
            user.tutorRef = refId;
        }

        await user.save();

        // 🔥 EMAIL (APPROVAL EMAIL)
        const message = `
        <div style="font-family: Arial; background:#f4f6fb; padding:20px;">
            <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
                
                <div style="background: linear-gradient(135deg, #065f46, #047857);padding:20px;text-align:center;color:white;">
                    <h2>${role === "learner" ? "Learner Enrollment Successful 🎓" : "Tutor Application Approved 🏆"}</h2>
                </div>

                <div style="padding:25px;">
                    <p>Hello ${user.fullName},</p>

                    <p>
                        Your ${role === "learner" ? "learning" : "teaching"} journey with TalentFlow is now active.
                    </p>

                    <div style="background:#ecfdf5;padding:15px;border-left:5px solid #047857;border-radius:6px;margin:20px 0;">
                        <strong>Your Reference Number:</strong><br/>
                        <span style="font-size:18px;color:#10e662;">${refId}</span>
                    </div>

                    <p>
                        You will need this reference number to complete your verification and access your dashboard.
                    </p>

                    <p>
                        Continue your journey by completing your verification.
                    </p>
                </div>
            </div>
        </div>
        `;

        await sendEmail(user.email, "TalentFlow Role Confirmation", message);

        res.json({
            message: "Role selected. Check your email.",
            role,
            refId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyRole = async (req, res) => {
    try {
        const { fullName, referenceNumber, course } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Match reference
        const validRef =
            user.role === "learner"
                ? user.learnerRef === referenceNumber
                : user.tutorRef === referenceNumber;

        if (!validRef) {
            return res.status(400).json({ message: "Invalid reference number" });
        }

        // Match name
        if (user.fullName !== fullName) {
            return res.status(400).json({ message: "Name does not match records" });
        }

        user.selectedCourse = course;
        user.isRoleVerified = true;

        await user.save();

        // 🔥 FINAL EMAIL
        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 25px; text-align: center; color: white;">
                    <h1>Welcome to TalentFlow 🎉</h1>
                    <p style="opacity:0.9;">Your journey officially begins now</p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p>Hello <strong>${user.fullName}</strong>,</p>

                    <p style="color:#555; line-height:1.6;">
                        Congratulations — your verification has been successfully completed and your profile is now fully active on TalentFlow.
                    </p>

                    <div style="margin:20px 0; padding:20px; background:#ecfdf5; border-left:5px solid #047857;">
                        <p style="margin:0;">Reference Number</p>
                        <h2 style="margin:5px 0 0; color:#065f46;">
                            ${referenceNumber}
                        </h2>
                    </div>

                    <p style="color:#555;">
                        You are now officially enrolled in the <strong>${course}</strong> course. This is your first step towards building real-world skills and achieving your goals with TalentFlow.:
                    </p>

                    <p style="font-weight:bold; color:#065f46;">
                        GROW IN IT
                    </p>

                    <p style="color:#555; line-height:1.6;">
                        This marks the beginning of your growth journey. TalentFlow is designed to help you build real-world skills, collaborate with others, and achieve meaningful progress in your chosen path.
                    </p>

                    <p style="color:#555; line-height:1.6;">
                        Stay consistent. Stay disciplined. Keep building. The platform is here to guide and support you every step of the way.
                    </p>

                    <p style="color:#555;">
                        You can always explore and enroll in additional courses as you grow.
                    </p>

                    <div style="text-align:center; margin-top:30px;">
                        <a href="#" style="
                            background:#047857;
                            color:white;
                            padding:12px 25px;
                            border-radius:6px;
                            text-decoration:none;
                            font-weight:bold;
                        ">
                            START YOUR JOURNEY
                        </a>
                    </div>
                </div>

                <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                    © ${new Date().getFullYear()} TrueMinds Ltd • TalentFlow
                </div>
            </div>
        </div>
        `;

        await sendEmail(user.email, "Welcome to TalentFlow", message);

        res.json({
            message: "Verification successful",
            course
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};