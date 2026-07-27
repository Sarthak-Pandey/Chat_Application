import dotenv from 'dotenv'
dotenv.config();

class StackOverflow{

    constructor(){
        this.baseUrl = process.env.STACK_OVERFLOW_API || "https://api.stackexchange.com/2.3"
    }

    buildSearchUrl(query){
        return `${this.baseUrl}/search/advanced?q=${encodeURIComponent(query)}&site=stackoverflow&order=desc&sort=relevance`
    }
    
    async fetchUrl(url){
        const response = await fetch(url);

        if(!response.ok){
            throw new Error( `Stack Overflow API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

      formatQuestions(data) {
        if (!data.items || data.items.length === 0) {
            return [];
        }

        return data.items.map((question) => ({
            title: question.title,
            score: question.score,
            answerCount: question.answer_count,
            acceptedAnswer: question.is_answered,
            tags: question.tags,
            link: question.link,
            viewCount: question.view_count,
            creationDate: new Date(
                question.creation_date * 1000
            ).toLocaleDateString(),
        }));
    }


    async searchQuestion(query){
        const url = this.buildSearchUrl(query);

        const data = await this.fetchUrl(url);

        return this.formatQuestions(data);
    }
}


export default new StackOverflow();

