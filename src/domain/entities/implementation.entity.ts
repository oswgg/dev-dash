



export class ImplementationEntity {
    constructor(
        public id: string,
        public userId: string,
        public service: string,
        public accessToken: string,
        public refreshToken: string,
        public username: string,
        public enabled: boolean
    ) {}
}