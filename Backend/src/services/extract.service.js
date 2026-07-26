import { tavily } from '@tavily/core'

const tvly = tavily({apiKey:process.env.TAVILY_API_KEY});


export const  extractWeb = async (arg)=>{
    const url = typeof arg === "string" ? arg : arg?.url;
    if (!url) {
        throw new Error("No URL provided to extractWeb.");
    }
    const result = await tvly.extract(url);
    return JSON.stringify(result);
}


