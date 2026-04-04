import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // MUST be false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

         transporter.verify((error, success) => {
            if (error) {
                console.log("SMTP ERROR:", error);
            } else {
                console.log("SMTP READY");
            }
        });

        const mailOptions = {
            from: `"TalentFlow" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email error:", error.message);
    }
};

export default sendEmail;