




export class CreateMondayImplementationDto {
    private constructor(
        public code: string,
        public userId: any,
    ) {}
    
    static create(data: { [key: string]: any }): [string?, CreateMondayImplementationDto?]  {
        const { code, userId } = data;
        
        if (!code) return ['Code is required'];
        if (!userId) return ['UserId is required'];
        
        return [
            undefined,
            new CreateMondayImplementationDto(code, userId)
        ];
    }
}