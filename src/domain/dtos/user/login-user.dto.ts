import { Validators } from "../../../config/validators";




export class LoginUserDto {
    private constructor(
        public email: string,
        public password: string
    ) { }
    
    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = object;

        if (!email) return ['Password is missing'] ;
        if (!Validators.email.test(email)) return ['Email is invalid'] ;
        if (!password) return ['Password is missing'] ;

        return [
            undefined,
            new LoginUserDto(email, password)
        ];

    }
}