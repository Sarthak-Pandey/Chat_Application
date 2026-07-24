import { tool } from "@langchain/core/tools"
import { searchInternet } from "../../services/internet.service.js"
import * as z from "zod"

const searchInternetSchema = z.object({
    query: z.string()
});

export const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Search the internet for information",
        schema: searchInternetSchema
    }
)
