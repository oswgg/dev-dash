import { BcryptAdapter, comparePasswordFunction, hashPasswordFunction } from "../../config/bcrypt";
import { CompareTokenFunction, JwtAdapter } from "../../config/jwt";
import { UserModel } from "../../data/mongoose/models";
import { UserDataSource } from "../../domain/datasources";
import { AuthenticateUserDto, LoginUserDto, RegisterUserDto } from "../../domain/dtos/user";
import { UserEntity } from "../../domain/entities";
import { UserMapper } from "../mappers";



export class MongoUserDataSourceImpls implements UserDataSource{
    constructor(
        private readonly hashPassword: hashPasswordFunction = BcryptAdapter.hash,
        private readonly comparePassword: comparePasswordFunction = BcryptAdapter.compare,
        private readonly compareToken:  CompareTokenFunction = JwtAdapter.compare
    ) { }

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
    
    async login(loginUserDto: LoginUserDto): Promise<UserEntity> { 
        const { email, password } = loginUserDto;
        try {
            const user = await UserModel.findOne({ email });
            if (!user) throw new Error('Invalid credentials');
            
            const isPasswordCorrect = await this.comparePassword(password, user.password);
            if (!isPasswordCorrect) throw new Error('Invalid credentials');
            
            return UserMapper.fromObjectToEntity(user);
            
        } catch (error) {
            throw error;
        }
    }
    
    async authenticate(userID: UserEntity['id']): Promise<UserEntity> {
        try {
            
            const user = await UserModel.findOne({ _id: userID });
            if (!user) throw new Error('User not found');
            
            const userEntity = UserMapper.fromObjectToEntity(user);
            
            return userEntity;
        } catch (error) {
            throw error;
        }
    }
}