import dotenv from 'dotenv';
dotenv.config();

class NpmService{
    constructor(){
        this.baseUrl = process.env.NPM_API
    }

    buildSearch(query){
        return `${this.baseUrl}/-/v1/search?text=${encodeURIComponent(query)}&size=10`;
    }

    async fetchFromNpm(url){
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`NPM API Error (${response.status}): ${await response.text()}`)
        }

        return await response.json();
    }

    formatPackages(data) {
    return data.objects.map(({ package: pkg }) => ({
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        keywords: pkg.keywords,
        date: pkg.date,
        links: pkg.links
        }));
    }

    async searchPackages(query){
        const url = this.buildSearch(query);
        const data = await this.fetchFromNpm(url);
        return this.formatPackages(data);
    }

}

export default new NpmService();

