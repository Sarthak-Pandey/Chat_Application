import { tavily } from '@tavily/core'

const tvly = tavily({apiKey:process.env.TAVILY_API_KEY})

const response = await tvly.extract("https://en.wikipedia.org/wiki/Artificial_intelligence")

console.log(response);