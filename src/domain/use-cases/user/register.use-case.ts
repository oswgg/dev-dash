import { JwtAdapter, SignTokenFunction } from "../../../config/jwt";
import { UserMapper } from "../../../infrastructure/mappers";
import { RegisterUserDto } from "../../dtos/user";
import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../../repositories";

type UserTokenResponse = {
    token: string;
    user: Omit<UserEntity, 'password'>;
}

export class RegisterUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly signToken: SignTokenFunction = JwtAdapter.sign
    ) { }
    
    async execute(registerUserDto: RegisterUserDto): Promise<UserTokenResponse> {
        const user = await this.userRepository.register(registerUserDto);
        
        const token = await this.signToken({ id: user.id });
        
        if (!token) throw new Error('Token is not generated');
        
        const userTokenResponse: UserTokenResponse = {
            token: token,
            user: UserMapper.toResponse(user)
        }
        
        return userTokenResponse;
    }
}