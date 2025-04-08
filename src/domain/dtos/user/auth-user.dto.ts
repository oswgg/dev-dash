



export class AuthenticateUserDto {
    private constructor(
        public token: string
    ) { }
    
    static create(object: { [key: string]: any }): [string?, AuthenticateUserDto?]  {
        const { token } = object;
        
        if (!token) return ['Token is missing'];
        
        
        return [
            undefined,
            new AuthenticateUserDto(token)
        ];
    }
}