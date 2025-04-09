import { LoginUserDto, RegisterUserDto } from "../dtos/user";
import { UserEntity } from "../entities/user.entity";




export abstract class UserRepository {
    abstract register(registerUserDto: RegisterUserDto) : Promise<UserEntity>;
    
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    
    abstract authenticate(authenticateUserDto: UserEntity['id']): Promise<UserEntity>;
}