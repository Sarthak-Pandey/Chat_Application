import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { tool } from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js"

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

const searchInternetSchema = z.object({
    query: z.string()
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Search the internet for information",
        schema: searchInternetSchema
    }
)

// Custom createAgent helper to prevent LangGraph prompt injection formatting errors on Groq model
export function createAgent({ model, tools, systemMessage }) {
    return {
        async invoke({ messages }) {
            const modelWithTools = model.bindTools(tools);
            const response = await modelWithTools.invoke(messages);

            if (response.tool_calls && response.tool_calls.length > 0) {
                const toolCall = response.tool_calls[0];
                if (toolCall.name === "searchInternet") {
                    const query = toolCall.args.query;
                    
                    let searchResult;
                    try {
                        searchResult = await searchInternet(query);
                    } catch (err) {
                        searchResult = `Error searching the internet: ${err.message}`;
                    }
                    const resultString = typeof searchResult === "string" ? searchResult : JSON.stringify(searchResult, null, 2);

                    const userQuery = messages[messages.length - 1].content;
                    const ragMessages = [
                        ...messages.slice(0, -1),
                        new HumanMessage(`Web search results for "${query}":\n${resultString}\n\nUser Question: ${userQuery}`)
                    ];

                    const finalResponse = await model.invoke(ragMessages);
                    return {
                        messages: [
                            ...messages,
                            response,
                            finalResponse
                        ]
                    };
                }
            }

            return {
                messages: [
                    ...messages,
                    response
                ]
            };
        },

        async *streamEvents({ messages }, options) {
            const modelWithTools = model.bindTools(tools);
            const response = await modelWithTools.invoke(messages);

            if (response.tool_calls && response.tool_calls.length > 0) {
                const toolCall = response.tool_calls[0];
                if (toolCall.name === "searchInternet") {
                    const query = toolCall.args.query;
                    
                    let searchResult;
                    try {
                        searchResult = await searchInternet(query);
                    } catch (err) {
                        searchResult = `Error searching the internet: ${err.message}`;
                    }
                    const resultString = typeof searchResult === "string" ? searchResult : JSON.stringify(searchResult, null, 2);

                    const userQuery = messages[messages.length - 1].content;
                    const ragMessages = [
                        ...messages.slice(0, -1),
                        new HumanMessage(`Web search results for "${query}":\n${resultString}\n\nUser Question: ${userQuery}`)
                    ];

                    const finalStream = await model.stream(ragMessages);
                    for await (const chunk of finalStream) {
                        if (chunk.content) {
                            yield {
                                event: "on_chat_model_stream",
                                data: {
                                    chunk: {
                                        content: chunk.content
                                    }
                                }
                            };
                        }
                    }
                    return;
                }
            }

            const finalStream = await model.stream(messages);
            for await (const chunk of finalStream) {
                if (chunk.content) {
                    yield {
                        event: "on_chat_model_stream",
                        data: {
                            chunk: {
                                content: chunk.content
                            }
                        }
                    };
                }
            }
        }
    };
}

const agent = createAgent({
    model: groqModel,
    tools: [searchInternetTool],
    systemMessage: "You are a helpful AI assistant."
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

export async function* GenerateResponseStream(messages) {
    const formattedMessages = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    });

    const stream = agent.streamEvents({ messages: formattedMessages }, { version: "v2" });
    for await (const event of stream) {
        if (event.event === "on_chat_model_stream") {
            const content = event.data.chunk.content;
            if (content) {
                yield content;
            }
        }
    }
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

