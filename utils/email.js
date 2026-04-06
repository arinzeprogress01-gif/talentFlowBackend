import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"TalentFlow - TrueMinds" <no-reply@talentflow.com>',
            to,
            subject,
            html
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Email error:", error.message);
    }
};

export default sendEmail;

/*import { Resend } from "resend";

const resend = new Resend('re_At9TUuwd_EQML41Eji6N3P5Mh3m9FLXjZ');

const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: "TalentFlow-TrueMinds LTD<onboarding@resend.dev>", // temporary sender
            to,
            subject,
            html, 
        });

        console.log("Email has been sent successfully");
    } catch (error) {
        console.error("Email error:", error.message);
    }
};

export default sendEmail;
*/

/*import axios from "axios";

const sendEmail = async (to, subject, html) => {
    try {
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "TalentFlow_TrueMinds Innovation Ltd",
                    email: "arinzeprogress01@gmail.com",
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Email sent via API");
    } catch (error) {
        console.error(
            "❌ Email API error:",
            error.response?.data || error.message
        );
    }
};

export default sendEmail;
*/