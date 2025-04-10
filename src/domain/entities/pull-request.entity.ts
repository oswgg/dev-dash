



export class PullRequestEntity {
    constructor(
        public id: number,
        public title: string,
        public url: string,
        public number: number,
        public user: string,
        public labels: Array<{ name: string, color: string }>,
        public state: string,
        public createdAt: Date,
    ) { }
    
    static create(data: PullRequestEntity): PullRequestEntity {
        return new PullRequestEntity(
            data.id,
            data.title,
            data.url,
            data.number,
            data.user,
            data.labels,
            data.state,
            data.createdAt,
        )
    }
}