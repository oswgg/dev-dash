import { PullRequestEntity, UserEntity } from "../entities";





export abstract class GithubNotificationsService {
    abstract sendUpdatedPullRequest(pullRequest: PullRequestEntity): void;
    abstract sendNewPullRequest(pullRequest: PullRequestEntity): void;
}

