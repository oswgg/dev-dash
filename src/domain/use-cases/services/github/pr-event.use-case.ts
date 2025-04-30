import { Inject, Injectable } from "@nestjs/common";
import { GithubNotificationsService } from "../../../services";
import { PullRequestEventDto } from "../../../dtos/services/github";
import { PullRequestEntity } from "../../../entities";
import { ImplementationRepository, UserRepository } from "../../../repositories";
import { CustomError } from "../../../errors/errors.custom";
import { IMPLEMENTATION_DATASOURCE } from "../../../../infrastructure/di/tokens";




@Injectable()
export class GithubPrEvent {
    private readonly actionHandlers: Record<string, (clientId: string, pr: PullRequestEntity) => void>;

    constructor(
        @Inject('GITHUB_NOTIFICATIONS_SERVICE')
        private readonly ghNotificationsService: GithubNotificationsService,

        @Inject(IMPLEMENTATION_DATASOURCE)
        private readonly implementationsRepository: ImplementationRepository
    ) { 
        this.actionHandlers = {
            'opened': (clientId: string, pr: PullRequestEntity) => this.ghNotificationsService.sendNewPullRequest(clientId, pr),
            'reopened': (clientId: string, pr: PullRequestEntity) => this.ghNotificationsService.sendNewPullRequest(clientId, pr),
            'edited': (clientId: string ,pr: PullRequestEntity) => this.ghNotificationsService.sendUpdatedPullRequest(clientId, pr),
            'closed': (clientId: string, pr: PullRequestEntity) => this.ghNotificationsService.sendUpdatedPullRequest(clientId, pr)
        }; 
    }
    
    async execute(data: PullRequestEventDto, sender: any): Promise<void> {
        const implementation = await this.implementationsRepository.getOne({
            service: 'github',
            username: sender.login
        });
        
        if (!implementation) throw CustomError.forbidden('Sender is not registered');
        
        const { userId } = implementation;
        
        const handler = this.actionHandlers[data.action];
        if (handler) {
            handler(userId.toString(), data.pullRequest);
        }
    }
    
}