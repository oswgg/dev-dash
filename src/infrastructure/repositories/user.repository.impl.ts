import { UserDataSource } from "../../domain/datasources";
import { RegisterUserDto } from "../../domain/dtos";
import { UserRepository } from "../../domain/repositories";



export class UserRepositoryImpl implements UserRepository {
    
    constructor(
        private readonly userDataSource: UserDataSource
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<any> {
        return this.userDataSource.register(registerUserDto);
    }

}