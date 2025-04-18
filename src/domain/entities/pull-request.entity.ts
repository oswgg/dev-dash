



export class PullRequestEntity {
    constructor(
        public id: number,
        public title: string,
        public number: number,
        public state: string,
        public author: string,
        public authorAvatar: string,
        public createdAt: Date,
        public updatedAt: Date,
        public url: string,
        public repositoryName: string,
        public body: string | null,
        public isDraft: boolean,
        public isMerged: boolean,
        public comments: number,
        public labels: Array<{ name: string, color: string }>,
        public assignees: Array<{ login: string, avatar_url: string }>
    ) { }
    
    static create(data: PullRequestEntity): PullRequestEntity {
        return new PullRequestEntity(
            data.id,
            data.title,
            data.number,
            data.state,
            data.author,
            data.authorAvatar,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            data.url,
            data.repositoryName,
            data.body,
            data.isDraft,
            data.isMerged,
            data.comments,
            data.labels,
            data.assignees
        )
    }
}