import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent } from "langchain"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { searchInternetTool } from "../tools/knowlegde/search.tool.js"
import { extractWebTool } from "../tools/knowlegde/extract.tool.js"

export const groqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
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
    tools: [searchInternetTool, extractWebTool],
    systemMessage: `You are a helpful AI assistant with search and web extraction capabilities.

Use the "searchInternet" tool to find relevant information, news, current events, weather, stock prices, or general facts when the user's query requires up-to-date or external information.

Use the "extractWeb" tool to retrieve the page content of a specific URL when the user provides a link or when you need to read the details of a specific webpage found during a search.

If you already know the answer and it is not time-sensitive, answer directly without using any tool.

When you use a tool, use its result as the primary source for your response.`,
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

