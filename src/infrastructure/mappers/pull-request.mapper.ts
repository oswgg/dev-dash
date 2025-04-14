import { PullRequestEntity } from "../../domain/entities"

export class PullRequestMapper {
    static fromOctokitToEntities(pullRequests: Array<any>): PullRequestEntity[] {
        return pullRequests.map(this.fromObjectToEntity);
    }
    
    static fromObjectToEntity(pr: { [key: string]: any }): PullRequestEntity {
        // Extraer el nombre del repositorio desde repository_url
        const repoUrlParts = pr.repository_url.split('/');
        const repositoryName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;
        
        return PullRequestEntity.create({
            id: pr.id,
            title: pr.title,
            number: pr.number,
            state: pr.state,
            author: pr.user.login,
            authorAvatar: pr.user.avatar_url,
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            url: pr.html_url,
            repositoryName: repositoryName,
            isDraft: pr.draft || false,
            isMerged: pr.pull_request?.merged_at !== null,
            comments: pr.comments,
            labels: pr.labels.map((label: any) => ({ 
                name: label.name || '', 
                color: label.color || '' 
            })),
            assignees: pr.assignees.map((assignee: any) => ({
                login: assignee.login,
                avatar_url: assignee.avatar_url
            }))
        });
    }
}