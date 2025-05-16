import { LoginUserDto, RegisterUserDto } from "../dtos/user";
import { UserEntity } from "../entities/user.entity";
import { UserTokenResponse } from "../use-cases/user";




export abstract class UserRepository {
    abstract register(registerUserDto: RegisterUserDto) : Promise<UserEntity>;
    
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    abstract loginWithOAuth(email: string): Promise<UserEntity>;
    
    abstract authenticate(authenticateUserDto: UserEntity['id']): Promise<UserEntity>;
}