



export class CreateGithubImplementationDto {
    private constructor(
        public code: string,
        public userId: any,
        public username: string
    ) {}
    
    static create(data: { [key: string]: any }): [string?, CreateGithubImplementationDto?]  {
        const { code, userId, username } = data;
       
        if (!code) return ['Code is required'];
        if (!userId) return ['UserId is required'];
        if (!username) return ['Username is required'];    


        
        return [
            undefined,
            new CreateGithubImplementationDto(code, userId, username)
        ];
    }
}