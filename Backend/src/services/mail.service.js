import dotenv from 'dotenv'
dotenv.config();
import nodemailer from 'nodemailer'

const authConfig = {
        user:process.env.GOOGLE_USER,
        pass:process.env.GOOGLE_APP_PASSWORD
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

