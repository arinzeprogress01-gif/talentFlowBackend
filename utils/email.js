import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
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