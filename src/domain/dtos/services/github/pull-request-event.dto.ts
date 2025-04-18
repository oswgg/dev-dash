import { PullRequestMapper } from "../../../../infrastructure/mappers";
import { PullRequestEntity } from "../../../entities";




export class PullRequestEventDto {
    constructor(
        public action: string,
        public pullRequest: PullRequestEntity
    ) { }
    
    static create(action: string, pullRequest: any): PullRequestEventDto {
        return new PullRequestEventDto(action, PullRequestMapper.fromObjectToEntity(pullRequest));
    }
}