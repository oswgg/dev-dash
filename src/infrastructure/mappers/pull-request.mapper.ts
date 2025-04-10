import { PullRequestEntity } from "../../domain/entities"





export class PullRequestMapper {
    static fromOctokitToEntities(pullRequests: Array<any>): PullRequestEntity[] {
        return pullRequests.map(this.fromObjectoToEntity);
    }
    
    static fromObjectoToEntity(pr: { [key: string]: any }): PullRequestEntity {
        return PullRequestEntity.create({
            id          : pr.id,
            title       : pr.title,
            url         : pr.html_url,
            number      : pr.number,
            user        : pr.user.login,
            labels      : pr.labels.map((label: any) => ({ name: label.name, color: label.color })),
            state       : pr.state,
            createdAt:   new Date(pr.created_at),
       });
    }
}