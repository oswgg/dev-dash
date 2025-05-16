import { Inject } from "@nestjs/common";
import { UserRepository } from "../../repositories";
import { UserTokenResponse } from "./register.use-case";
import { SIGN_TOKEN, USER_REPOSITORY } from "../../../infrastructure/di/tokens";
import { SignTokenFunction } from "../../../config/jwt";
import { InternalServerException, NotFoundException } from "../../errors/errors.custom";
import { UserMapper } from "../../../infrastructure/mappers";


export const LOGIN_WITH_OAUTH = Symbol('LOGIN_WITH_OAUTH');


export class LoginWithOAuth { 
    constructor( 
        @Inject(SIGN_TOKEN) private readonly signToken: SignTokenFunction,
        @Inject(USER_REPOSITORY)private readonly userRepository: UserRepository
    ) { }

    async execute(email: string): Promise<UserTokenResponse> {
        const user = await this.userRepository.loginWithOAuth(email);
        if (!user) throw new NotFoundException('Not Found', 'User with this email was not found', { sent: { email } });

        const token = await this.signToken({ id: user.id });
        
        if (!token) throw new InternalServerException('Token was not generated');
        
        const userTokenResponse: UserTokenResponse = {
            token: token,
            user: UserMapper.noPassword(user)
        }
        
        return userTokenResponse;
    }
}