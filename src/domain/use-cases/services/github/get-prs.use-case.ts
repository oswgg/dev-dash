import { getOctokitAdapter, OctokitAdapterConstructor } from "../../../../config/octokit";
import { ImplementationRepository } from "../../../repositories";
import { PullRequestEntity } from "../../../entities";





export class GithubGetPullRequest {
    constructor( 
        private readonly implementationsRepository: ImplementationRepository,
        private octokitAdapter: Promise<OctokitAdapterConstructor> = getOctokitAdapter()
    ) { }
    
    async execute(userId: any): Promise<PullRequestEntity[] | null> {
        const githubImplementation = await this.implementationsRepository.getOne({ userId, service: 'github' })
        if (!githubImplementation) throw new Error('User has no github implementation');
        
        const OctokitAdapter = await this.octokitAdapter;
        const octoClient = new OctokitAdapter(githubImplementation.accessToken);
        
        const pulLRequests = await octoClient.getPullRequests({ query: 'type:pr user:oswgg state:open' });
        
        return pulLRequests;
    }
}