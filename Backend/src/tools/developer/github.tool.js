import { tool } from "@langchain/core/tools"
import githubService from '../../services/github.service.js'
import * as z from 'zod'

const githubSearchSchema = z.object({
    query:z.string().describe('The search query for GitHub repositories')
})

export const githubSearchTool = tool(
    async ({ query }) => {
        return await githubService.searchRepositories(query);
    },
    {
        name: "searchRepositories",
        description: "Search GitHub public repositories by keywords and return repository information such as name, owner, description, stars, language, and URL.",
        schema: githubSearchSchema
    }
);



