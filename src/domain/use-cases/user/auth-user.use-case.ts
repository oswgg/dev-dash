import { CompareTokenFunction, JwtAdapter } from "../../../config/jwt";
import { UserEntity } from "../../entities";
import { UnauthorizedException } from "../../errors/errors.custom";
import { UserRepository } from "../../repositories";




export class AuthUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly compareToken: CompareTokenFunction = JwtAdapter.compare
    ) { }
    
    async execute(token: string): Promise<UserEntity> {
        const decoded: { id: string } = await this.compareToken(token);
        
        if (!decoded) throw new UnauthorizedException('Invalid Token', 'Token is invalid');
        if (!decoded.id) throw new UnauthorizedException('Invalid Token', 'Token is invalid');
        
        return this.userRepository.authenticate(decoded.id);
    }
}