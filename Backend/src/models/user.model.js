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
            select: false,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, 
    }
);

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

userSchema.set("toObject", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("User", userSchema);