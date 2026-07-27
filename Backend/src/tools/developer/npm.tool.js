import { tool } from '@langchain/core/tools'
import npmService from '../../services/npm.service.js';
import * as z from 'zod';

const npmSchema = z.object({
    query:z.string()
})

export const npmTool = tool(
    async ({ query }) => {
        return await npmService.searchPackages(query);
    },
    {
        name:"searchNPM",
        description:"Search NPM for packages",
        schema:npmSchema
    }
)

