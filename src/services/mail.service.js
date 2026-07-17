import dotenv from 'dotenv'
dotenv.config();
import nodemailer from 'nodemailer'

const authConfig = {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      };

const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: authConfig,
});

tranporter.verify(async (err, success) => {
    if (err) {
        console.error("Nodemailer Verify Error:", err);
    } else {
        console.log("Nodemailer is ready to send emails", success);
    }
});

export async function sendMail({ to, subject, html, text }) {
    const mailOption = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await tranporter.sendMail(mailOption);
    console.log("Email sent successfully");
}