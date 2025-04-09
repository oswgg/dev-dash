import { JwtAdapter, SignTokenFunction } from "../../../config/jwt";
import { UserMapper } from "../../../infrastructure/mappers";
import { LoginUserDto } from "../../dtos/user";
import { UserEntity } from "../../entities";
import { UserRepository } from "../../repositories";


type UserTokenResponse = {
    token: string;
    user: Omit<UserEntity, 'password'>;
}


export class LoginUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly signToken: SignTokenFunction = JwtAdapter.sign
    ) { }
    
    async execute(loginUserDto: LoginUserDto): Promise<UserTokenResponse> {

        const user = await this.userRepository.login(loginUserDto);
        
        const token = await this.signToken({ id: user.id });
        if (!token) throw new Error('Token is not generated');
        
 
        const userTokenResponse: UserTokenResponse = {
            token: token,
            user: UserMapper.noPassword(user)
        }
        
        return userTokenResponse
    }
}