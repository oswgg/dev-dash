import { RegisterUserDto } from "../dtos/user/register-user.dto";



export abstract class UserDataSource {
    abstract register(registerUserDto: RegisterUserDto) : Promise<any>;
}