import { Injectable } from "@nestjs/common";
import { Validators } from "../../../config/validators"


@Injectable()
export class RegisterUserDto {
    constructor(
        public name: string,
        public email: string,
        public password: string
    ) {}

    static create(body: { [key: string]: any }): [string?, RegisterUserDto?] {
        
        const { name, email, password } = body;
        
        if (!name)                         return ['Name is missing'];
        if (!email)                        return ['Email is missing'];              
        if (!Validators.email.test(email)) return ['Email is invalid'];
        if (!password)                     return ['Password is missing'];                   
        if (password.length < 8)           return ['Password is too short'];

        return [
            undefined,
            new RegisterUserDto(name, email, password)
        ];
    }
}