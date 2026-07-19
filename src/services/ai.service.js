
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
});

export async function testAi(){
    model.invoke("what is ai explain under 100 word?").then((response)=>{
        console.log(response.text);
    })
}



