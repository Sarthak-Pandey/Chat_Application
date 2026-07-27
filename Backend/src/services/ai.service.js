import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent } from "langchain"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { searchInternetTool } from "../tools/knowlegde/search.tool.js"
import { extractWebTool } from "../tools/knowlegde/extract.tool.js"
import {githubSearchTool} from "../tools/developer/github.tool.js"

export const groqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
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
    tools: [searchInternetTool, extractWebTool,githubSearchTool],
    systemMessage: `You are a helpful AI assistant with access to multiple external tools. Your goal is to provide accurate, helpful, and up-to-date answers by deciding when to use the appropriate tool.

Tool Usage Guidelines:

1. searchInternet
- Use this tool when the user's question requires current or external information.
- Examples:
  - Latest news
  - Current events
  - Weather
  - Stock prices
  - Recent technologies
  - General web search
  - Information that may have changed over time

2. extractWeb
- Use this tool when the user provides a URL or when you need to read the full content of a specific webpage.
- Use it to extract detailed information from articles, blogs, documentation, or websites instead of relying only on search snippets.

3. githubRepositorySearch
- Use this tool whenever the user is looking for GitHub repositories or open-source projects.
- Also use it when the user asks for:
  - Source code examples
  - Project implementations
  - Open-source libraries
  - Framework implementations
  - Sample projects
  - Repository recommendations
  - Production-ready code
  - AI, machine learning, web development, backend, frontend, DevOps, or system design repositories
  - GitHub repositories related to any programming language, framework, or technology

Do NOT use GitHub search for general programming explanations unless the user specifically requests repositories, source code, implementations, or examples from GitHub.

General Rules:
- If you already know the answer and it is not time-sensitive, answer directly without using any tool.
- Use tools only when they improve the quality or accuracy of the response.
- If multiple tools are needed, use them in the appropriate order.
- When using a tool, base your final answer primarily on the tool's output.
- Never invent information when a relevant tool can provide accurate data.`,
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

