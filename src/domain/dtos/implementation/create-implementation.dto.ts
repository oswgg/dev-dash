import { ImplementationService } from "../../../data/mongoose/models";




export class CreateImplementationDto {
    private constructor(
        public userId: string,
        public service: ImplementationService,
        public accessToken: string,
        public refreshToken: string | null, 
        public username: string,
    ) {}
    
    static create(data: { [key: string]: any }): [string?, CreateImplementationDto?]  {
        const { userId, service, accessToken, username, refreshToken } = data;
        
        if (!userId) return ['UserId is required'];
        if (!service) return ['Service is required'];
        if (!accessToken) return ['AccessToken is required'];
        if (!username) return ['Username is required'];
        
        return [
            undefined,
             new CreateImplementationDto(userId, service, accessToken, refreshToken, username)
        ];
    }
}