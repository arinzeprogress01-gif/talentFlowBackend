
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: "TalentFlow_-TrueMinds LTD<onboarding@resend.dev>", // temporary sender
            to,
            subject,
            html, 
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email error:", error.message);
    }
};

export default sendEmail;

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