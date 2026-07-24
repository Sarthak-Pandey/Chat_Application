import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const searchInternetTool = tool(
    async (arg) => {
        return "fake search result";
    },
    {
        name: "searchInternet",
        description: "Search the internet for information",
        schema: z.object({ query: z.string() })
    }
);

async function testModel(modelName) {
    try {
        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: modelName,
            temperature: 0,
        });

        const modelWithTools = model.bindTools([searchInternetTool]);
        const response = await modelWithTools.invoke([
            ["human", "Fifa world cup 2026 winner"]
        ]);
        
        console.log(`Model ${modelName} SUCCESS! Tool calls:`, JSON.stringify(response.tool_calls));
        return true;
    } catch (err) {
        console.error(`Model ${modelName} FAILED:`, err.message);
        return false;
    }
}

async function main() {
    const models = [
        "llama-3.3-70b-versatile",
        "llama3-groq-70b-8192-tool-use-preview",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768",
        "gemma2-9b-it"
    ];

    for (const m of models) {
        console.log(`\nTesting ${m}...`);
        await testModel(m);
    }
}

main();
