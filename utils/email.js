import axios from "axios";

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