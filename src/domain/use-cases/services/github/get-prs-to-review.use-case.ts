import { getOctokitAdapter, OctokitAdapterConstructor } from "../../../../config/octokit";
import { PullRequestEntity } from "../../../entities";
import { ForbiddenException } from "../../../errors/errors.custom";
import { ImplementationRepository } from "../../../repositories";

export class GithubGetPullRequestToReview {
    constructor(
        private readonly implementationsRepository: ImplementationRepository,
        private octokitAdapter: Promise<OctokitAdapterConstructor> = getOctokitAdapter()
    ) { }
    
    async execute(userId: string): Promise<PullRequestEntity[] | null> {
        const ghImplementation = await this.implementationsRepository.getOne({ userId, service: 'github' })
        if (!ghImplementation) throw new ForbiddenException('Forbidden', 'User has no github implementation');
        
        const OctokitAdapter = await this.octokitAdapter;
        const octoClient = new OctokitAdapter(ghImplementation.accessToken, userId);
        
        const username = ghImplementation.username || '';
        const queryForPRsToReview = `type:pr review-requested:${username} state:open`;
        
        const pullRequests = await octoClient.getPullRequests(
            { query: queryForPRsToReview },
            this.implementationsRepository
        );
        
        return pullRequests;
    }
}