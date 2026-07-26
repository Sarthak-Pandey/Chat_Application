import { tool } from "@langchain/core/tools"
import { extractWeb } from "../../services/extract.service.js"
import * as z from "zod"

const extractWebSchema = z.object({
    url: z.string()
})

export const extractWebTool = tool(
    extractWeb,
    {
        name: "extractWeb",
        description: "Extract information from a website",
        schema: extractWebSchema
    }
)
