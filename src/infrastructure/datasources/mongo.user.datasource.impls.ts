import { BcryptAdapter, hashFunction } from "../../config/bcrypt";
import { UserModel } from "../../data/mongoose/models";
import { UserDataSource } from "../../domain/datasources";
import { RegisterUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { UserMapper } from "../mappers";



export class MongoUserDataSourceImpls implements UserDataSource{
    constructor(
        private readonly hashPassword: hashFunction = BcryptAdapter.hash
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        try {
            const { name, email, password } = registerUserDto;
        
            const existsEmail = await UserModel.findOne({ email });
            if (existsEmail) throw new Error('Email already exists');
            
            const user = await UserModel.create({
                name,
                email,
                password: await this.hashPassword(password)
            });
            
            const userEntity = UserMapper.fromObjectToEntity(user);
            
            return userEntity;
        } catch (error) {
            throw error;
        }
    }
}