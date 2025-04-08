import { UserDataSource } from "../../domain/datasources";
import { AuthenticateUserDto, LoginUserDto, RegisterUserDto } from "../../domain/dtos/user";
import { UserEntity } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";



export class UserRepositoryImpl implements UserRepository {
    
    constructor(
        private readonly userDataSource: UserDataSource
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<any> {
        return this.userDataSource.register(registerUserDto);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.userDataSource.login(loginUserDto);
    }
    
    async authenticate(authenticateUserDto: UserEntity['id']): Promise<UserEntity> {
        return this.userDataSource.authenticate(authenticateUserDto);
    }
}