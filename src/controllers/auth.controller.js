import { userModel } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { sendMail } from '../services/mail.service.js';


export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email is already registered"
            });
        }

        const newUser = await userModel.create({
            username,
            email,
            password
        });

        try {
            await sendMail({
                to: email,
                subject: "Welcome to Perplexity",
                html: `<h1>Hello ${username},</h1>
                <p>Thank You registering at <strong>Perplexity</strong>.</p>
                <p>We're excited to have you on board.</p>
                <p>Best regards,</p>
                <p>The Perplexity Team</p>`
            });
        } catch (mailError) {
            console.error("Warning: Welcome email failed to send:", mailError.message || mailError);
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Register Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
}
