import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage,SystemMessage,AIMessage } from "@langchain/core/messages"


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


export async function GenerateResponse(messages){
    const response = await groqModel.invoke(messages.map(msg=>{
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }
        else{
            return new AIMessage(msg.content);
        }
    }));
    return response.content;
}

export async function* GenerateResponseStream(messages){
    const stream = await groqModel.stream(messages.map(msg=>{
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }
        else{
            return new AIMessage(msg.content);
        }
    }));
    for await (const chunk of stream) {
        yield chunk.content;
    }
}


export async function GenerateChatTitle(message){

    const response = await mistralModel.invoke(
        [
            new SystemMessage(`You are a chat title generator. Please generate a concise title for the following conversation.`),
            new HumanMessage(`Generate the title for a chat conversation: ${message}`)
        ]
    )

    return response.content;

}

