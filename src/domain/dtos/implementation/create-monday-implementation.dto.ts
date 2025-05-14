import { IErrorDescription } from "../../errors/errors.custom";





export class CreateMondayImplementationDto {
    private constructor(
        public code: string,
        public userId: any,
    ) {}
    
    static create(data: { [key: string]: any }): [IErrorDescription[]?, CreateMondayImplementationDto?]  {
        const { code, userId } = data;
       
        const errors: IErrorDescription[] = [];
        if (!code)   errors.push({ message: 'Code is required' });
        if (!userId) errors.push({ message: 'UserId is required' });
        
        if (errors.length > 0) return [ errors, undefined ];

        return [
            undefined,
            new CreateMondayImplementationDto(code, userId)
        ];
    }
}