import { PullRequestEntity, UserEntity } from "../entities";





export abstract class GithubNotificationsService {
    abstract sendUpdatedPullRequest(clientId: any, pullRequest: PullRequestEntity): void;
    abstract sendNewPullRequest(clientId: any, pullRequest: PullRequestEntity): void;
    abstract sendPullRequestMerged(clientId: any, pullRequest: PullRequestEntity): void;
}

