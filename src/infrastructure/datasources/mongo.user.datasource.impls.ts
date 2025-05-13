import { Inject, Injectable } from "@nestjs/common";
import { BcryptAdapter, comparePasswordFunction, hashPasswordFunction } from "../../config/bcrypt";
import { CompareTokenFunction, JwtAdapter } from "../../config/jwt";
import { UserModel } from "../../data/mongoose/models";
import { UserDataSource } from "../../domain/datasources";
import { LoginUserDto, RegisterUserDto } from "../../domain/dtos/user";
import { UserEntity } from "../../domain/entities";
import { UserMapper } from "../mappers";
import { COMPARE_PASSWORD, COMPARE_TOKEN, HASH_PASSWORD } from "../di/tokens";
import { DuplicatedException, ForbiddenException, NotFoundException } from "../../domain/errors/errors.custom";



@Injectable()
export class MongoUserDataSourceImpls implements UserDataSource {
    constructor(
        @Inject(HASH_PASSWORD) private readonly hashPassword: hashPasswordFunction,
        @Inject(COMPARE_PASSWORD) private readonly comparePassword: comparePasswordFunction ,
        @Inject(COMPARE_TOKEN) private readonly compareToken:  CompareTokenFunction 
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        try {
            const { name, email, password, fromOAuth } = registerUserDto;
            
            const existsEmail = await UserModel.findOne({ email });
            if (existsEmail) throw new DuplicatedException('Duplicated', 'Email already exists', { email });
            
            const hashedpassword = fromOAuth ? null : await this.hashPassword(password!);
            
            const user = await UserModel.create({
                name,
                email,
                fromOAuth,
                password: hashedpassword
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
            if (!user) throw new ForbiddenException('Invalid Credentials', 'User or password are invalid', { sent: { email, password } });
            
            const isPasswordCorrect = await this.comparePassword(password, user.password!);
            if (!isPasswordCorrect) throw new ForbiddenException('Invalid Credentials', 'User or password are invalid', { sent: { email, password } });
            
            return UserMapper.fromObjectToEntity(user);
            
        } catch (error) {
            throw error;
        }
    }
    
    async authenticate(userID: UserEntity['id']): Promise<UserEntity> {
        try {
            
            const user = await UserModel.findOne({ _id: userID });
            if (!user) throw new NotFoundException('Not Found', `Token's user was not found`);
            
            const userEntity = UserMapper.fromObjectToEntity(user);
            
            return userEntity;
        } catch (error) {
            throw error;
        }
    }
}