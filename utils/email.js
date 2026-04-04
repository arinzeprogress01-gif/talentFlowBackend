import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
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