import { CompareTokenFunction, JwtAdapter } from "../../../config/jwt";
import { AuthenticateUserDto } from "../../dtos/user";
import { UserEntity } from "../../entities";
import { UserRepository } from "../../repositories";




export class AuthUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly compareToken: CompareTokenFunction = JwtAdapter.compare
    ) { }
    
    async execute(authenticateUserDto: AuthenticateUserDto): Promise<UserEntity> {
        const decoded: { id: string } = await this.compareToken(authenticateUserDto.token);
        
        if (!decoded) throw new Error('Token is invalid');
        if (!decoded.id) throw new Error('Token is invalid');
        
        return this.userRepository.authenticate(decoded.id);
    }
}