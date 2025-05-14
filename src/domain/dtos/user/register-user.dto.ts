import { Injectable } from "@nestjs/common";
import { Validators } from "../../../config/validators"
import { IErrorDescription } from "../../errors/errors.custom";


@Injectable()
export class RegisterUserDto {
    constructor(
        public name: string,
        public email: string,
        public password: string | null,
        public fromOAuth: boolean = false,
    ) {}

    static create(body: { [key: string]: any }): [IErrorDescription[]?, RegisterUserDto?] {
        
        const errors : IErrorDescription[] = [];
        const { name, email, password, fromOAuth } = body;
        
        if (!name)                                  errors.push({ message: 'Name is required' });
        if (!email)                                 errors.push({ message: 'Email is required' });
        if (email && !Validators.email.test(email)) errors.push({ message: 'Email is invalid' });
        if (!fromOAuth) {
            if (!password)                             errors.push({ message: 'Password is required' });;                   
            if (password && password.length < 8)       errors.push({ message: 'Password is too short' });
        } 
        
        if (errors.length > 0) return [ errors, undefined ];

        return [
            undefined,
            new RegisterUserDto(name, email, password, fromOAuth)
        ];
    }
}