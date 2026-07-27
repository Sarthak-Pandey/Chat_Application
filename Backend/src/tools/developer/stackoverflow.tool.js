import { tool } from 'langchain'
import stackoverFlowService from '../../services/stackoverFlow.service.js'
import * as z from 'zod'

const stackSchema = z.object({
    query: z.string()
})

export const stacktool = tool(
    async ({ query }) => {
        return await stackoverFlowService.searchQuestion(query);
    },
    {
        name: "stackoverflow",
        description: "Search StackOverflow for questions",
        schema: stackSchema
    }
)


