import { Validators } from "../../../config/validators";
import { IErrorDescription } from "../../errors/errors.custom";




export class LoginUserDto {
    private constructor(
        public email: string,
        public password: string
    ) { }
    
    static create(object: { [key: string]: any }): [IErrorDescription[]?, LoginUserDto?] {
        const { email, password } = object;
        
        const errors: IErrorDescription[] = [];

        if (!email)                                 errors.push({ message: 'Email is required' });
        if (email && !Validators.email.test(email)) errors.push({ message: 'Email is invalid' });
        if (!password)                              errors.push({ message: 'Password is missing' });
        
        if (errors.length > 0) return [ errors, undefined ]

        return [
            undefined,
            new LoginUserDto(email, password)
        ];

    }
}