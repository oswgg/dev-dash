import { Inject } from "@nestjs/common";
import { SignTokenFunction } from "../../../config/jwt";
import { UserMapper } from "../../../infrastructure/mappers";
import { RegisterUserDto } from "../../dtos/user";
import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../../repositories";
import { SIGN_TOKEN, USER_REPOSITORY } from "../../../infrastructure/di/tokens";

type UserTokenResponse = {
    token: string;
    user: Omit<UserEntity, 'password'>;
}

export const REGISTER_USER = Symbol('REGISTER_USER');

export class RegisterUser {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(SIGN_TOKEN)
        private readonly signToken: SignTokenFunction
    ) { }
    
    async execute(registerUserDto: RegisterUserDto): Promise<UserTokenResponse> {
        const user = await this.userRepository.register(registerUserDto);
        
        const token = await this.signToken({ id: user.id });
        
        if (!token) throw new Error('Token was not generated');
        
        const userTokenResponse: UserTokenResponse = {
            token: token,
            user: UserMapper.noPassword(user)
        }
        
        return userTokenResponse;
    }
}