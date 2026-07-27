import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent } from "langchain"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import {SYSTEM_PROMPT} from './prompts/system.prompt.js'
import { tools } from "./toolRegistry.js";

export const groqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "qwen/qwen3.6-27b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})

export const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})

const agent = createAgent({
    model: groqModel,
    tools: tools,
    systemMessage: SYSTEM_PROMPT,
});

export async function GenerateResponse(messages) {
    const formattedMessages = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    });

    const response = await agent.invoke({ messages: formattedMessages });
    const lastMessage = response.messages[response.messages.length - 1];
    return lastMessage.content;
}


export async function GenerateChatTitle(message) {
    const response = await mistralModel.invoke(
        [
            new SystemMessage(`You are a chat title generator. Please generate a concise title for the following conversation.`),
            new HumanMessage(`Generate the title for a chat conversation: ${message}`)
        ]
    )

    return response.content;
}

