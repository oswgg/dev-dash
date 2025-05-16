import { RegisterUserDto, LoginUserDto } from "../dtos/user";
import { UserEntity } from "../entities";



export abstract class UserDataSource {
    abstract register(registerUserDto: RegisterUserDto) : Promise<UserEntity>;
    
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    abstract loginWithOAuth(email: string): Promise<UserEntity>;
    
    abstract authenticate(authenticateUserDto: UserEntity['id']): Promise<UserEntity>;
}