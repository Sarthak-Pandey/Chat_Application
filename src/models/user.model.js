import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false, // Prevents password from being returned in query results by default
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);