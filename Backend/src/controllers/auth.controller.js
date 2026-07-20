import { userModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
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
            // Requirement: Already registered but not verified Email check
            if (existingUser.email.toLowerCase() === email.toLowerCase() && !existingUser.verified) {
                return res.status(400).json({
                    success: false,
                    isUnverifiedExisting: true,
                    email: existingUser.email,
                    message: "This email is already registered but not verified. Please check your inbox and verify your email before logging in."
                });
            }
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

        const emailVerificationToken = jwt.sign({
            email: newUser.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        try {
            await sendMail({
                to: email,
                subject: "Welcome to Perplexity",
                html: `<h1>Hello ${username},</h1>
                <p>Thank You registering at <strong>Perplexity</strong>.</p>
                <p>Please verify your email by clicking on the link below:</p>
                <a href="http://localhost:5173/login?token=${emailVerificationToken}">Verify Email</a>
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

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false
            });
        }

        user.verified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your email has been verified successfully. You can now log in."
        });
    } catch (error) {
        console.error("Verify Email Error:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Invalid or expired verification token"
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {   
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Requirement: Log in unverified user block with custom flag & message
        if (!user.verified) {
            return res.status(400).json({
                success: false,
                isUnverifiedUser: true,
                email: user.email,
                message: "Your email is not verified yet. Please verify your email before logging in."
            });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user
        });

    } catch (error) {
        console.error("Login Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get Me Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function resendVerification(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        try {
            await sendMail({
                to: user.email,
                subject: "Welcome to Perplexity",
                html: `<h1>Hello ${user.username},</h1>
                <p>Thank You registering at <strong>Perplexity</strong>.</p>
                <p>Please verify your email by clicking on the link below:</p>
                <a href="http://localhost:5173/login?token=${emailVerificationToken}">Verify Email</a>
                <p>We're excited to have you on board.</p>
                <p>Best regards,</p>
                <p>The Perplexity Team</p>`
            });
        } catch (mailError) {
            console.error("Warning: Resend email failed to send:", mailError.message || mailError);
        }

        return res.status(200).json({
            success: true,
            message: "Verification link resent successfully"
        });

    } catch (error) {
        console.error("Resend Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during resending verification"
        });
    }
}
