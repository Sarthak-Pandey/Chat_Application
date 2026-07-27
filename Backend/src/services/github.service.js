import dotenv from 'dotenv'
dotenv.config();

class GithubService{

    constructor(){
        this.baseUrl = process.env.GITHUB_API
    }

    getHeader(){
        return {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept:"application/vnd.github+json"
        };
    }

    buildSearch(query){
        return `${this.baseUrl}/search/repositories?q=${encodeURIComponent(
            query
        )}`;
    }

    async fetchFromGitHub(url){
        const response = await fetch(url,{
            method:"GET",
            headers:this.getHeader()
        });

        if(!response.ok){
            const error = await response.text();

            throw new Error(
                `GitHub API Error (${response.status}): ${error}`
            )
        }

        return await response.json();
    }


    formatRepositories(repositories) {
        return repositories.map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            owner: repo.owner.login,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics,
            visibility: repo.visibility,
            defaultBranch: repo.default_branch,
            url: repo.html_url,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
        }));
    }

    
    async searchRepositories(query){
        const url = this.buildSearch(query);

        const data = await this.fetchFromGitHub(url);

        return this.formatRepositories(data.items);
    }
}

export default new GithubService();

