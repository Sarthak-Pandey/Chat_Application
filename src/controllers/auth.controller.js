import { userModel } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

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

        
    } catch (error) {
        console.error("Register Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
}
