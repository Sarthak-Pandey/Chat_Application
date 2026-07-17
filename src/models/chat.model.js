import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User association is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Chat title is required"],
            trim: true,
            default: "New Chat",
        },
    },
    {
        timestamps: true, 
    }
);

export const chatModel = mongoose.model("Chat", chatSchema);
