import { PullRequestMapper } from "../../../../infrastructure/mappers";
import { PullRequestEntity } from "../../../entities";
import { IErrorDescription } from "../../../errors/errors.custom";




export class PullRequestEventDto {
    constructor(
        public action: string,
        public pullRequest: PullRequestEntity
    ) { }
    
    static create(action: string, pullRequest: any): [IErrorDescription[]?, PullRequestEventDto?] {
        const errors: IErrorDescription[] = [];

        if (!action)      errors.push({ message: 'Action is missing '});
        if (!pullRequest) errors.push({ message: 'Pull request is missing '});
        
        if (errors.length > 0) return [ errors, undefined ];
        
        return [
            undefined,
            new PullRequestEventDto(
                action,
                pullRequest
            )
        ]
    }
}