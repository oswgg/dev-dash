import { Inject, Injectable } from "@nestjs/common";
import { GithubNotificationsService } from "../../../services";
import { PullRequestEventDto } from "../../../dtos/services/github";
import { PullRequestEntity } from "../../../entities";




@Injectable()
export class GithubPrEvent {
    private readonly actionHandlers: { [key: string]: (pr: PullRequestEntity) => void } = {
        'opened': (pr: any) => this.ghNotificationsService.sendNewPullRequest(pr),
        'reopened': (pr: any) => this.ghNotificationsService.sendNewPullRequest(pr),
        'closed': (pr: any) => this.ghNotificationsService.sendUpdatedPullRequest(pr),
    }

    constructor(
        @Inject('GITHUB_NOTIFICATIONS_SERVICE')
        private readonly ghNotificationsService: GithubNotificationsService
    ) { }
    
    async execute(data: PullRequestEventDto): Promise<void> {
        return this.actionHandlers[data.action](data.pullRequest);
    }
    
}