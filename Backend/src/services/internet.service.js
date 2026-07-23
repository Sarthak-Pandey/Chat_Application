import {tavily as Tavily} from "@tavily/core"

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export const searchInternet = async (arg)=>{
    const query = typeof arg === "string" ? arg : arg?.query;
    if (!query) {
        throw new Error("No search query provided to searchInternet.");
    }
    const result =  await tavily.search(query,{
        maxResults:5,
        searchDepth:"advanced"
    })
    return JSON.stringify(result)
}

