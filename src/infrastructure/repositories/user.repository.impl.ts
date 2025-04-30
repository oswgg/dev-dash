import { Inject } from "@nestjs/common";
import { UserDataSource } from "../../domain/datasources";
import { AuthenticateUserDto, LoginUserDto, RegisterUserDto } from "../../domain/dtos/user";
import { UserEntity } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";
import { USER_DATASOURCE } from "../di/tokens";



export class UserRepositoryImpl implements UserRepository {
    
    constructor(
        @Inject(USER_DATASOURCE)
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