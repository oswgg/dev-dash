import { RegisterUserDto, AuthenticateUserDto } from "../dtos/user";
import { UserEntity } from "../entities";



export abstract class UserDataSource {
    abstract register(registerUserDto: RegisterUserDto) : Promise<UserEntity>;
    
    abstract authenticate(authenticateUserDto: UserEntity['id']): Promise<UserEntity>;
}