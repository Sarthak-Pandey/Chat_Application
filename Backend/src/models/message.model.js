import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "Chat association is required"],
            index: true,
        },
        content: {
            type: String,
            required: [true, "Message content is required"],
        },
        role: {
            type: String,
            enum: ["user", "ai"],
            required: [true, "Role must be either 'user' or 'ai'"],
        },
        
        sources: [
            {
                title: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
                snippet: {
                    type: String,
                },
            },
        ],
        suggestions: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const messageModel = mongoose.model("Message", messageSchema);
