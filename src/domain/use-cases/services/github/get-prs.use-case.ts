import { getOctokitAdapter, OctokitAdapterConstructor } from "../../../../config/octokit";
import { ImplementationRepository } from "../../../repositories";
import { PullRequestEntity } from "../../../entities";
import { ForbiddenException } from "../../../errors/errors.custom";





export class GithubGetPullRequest {
    constructor( 
        private readonly implementationsRepository: ImplementationRepository,
        private octokitAdapter: Promise<OctokitAdapterConstructor> = getOctokitAdapter()
    ) { }
    
    async execute(userId: any): Promise<PullRequestEntity[] | null> {
        const ghImplementation = await this.implementationsRepository.getOne({ userId, service: 'github' })
        if (!ghImplementation) throw new ForbiddenException('Forbidden', 'User has no github implementation');
        
        const OctokitAdapter = await this.octokitAdapter;
        const octoClient = new OctokitAdapter(ghImplementation.accessToken, userId);
        
        const queryForOpenPRs = `type:pr user:${ghImplementation.username} state:open`;
        
        const pulLRequests = await octoClient.getPullRequests(
            { query: queryForOpenPRs },
            this.implementationsRepository
        );
        
        return pulLRequests;
    }
}