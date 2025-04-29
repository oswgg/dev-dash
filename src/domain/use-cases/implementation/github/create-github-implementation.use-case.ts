import { GithubAdapter } from "../../../../config/github";
import { CreateGithubImplementationDto } from "../../../dtos/implementation";
import { ImplementationEntity } from "../../../entities";
import { ImplementationRepository } from "../../../repositories";


export class CreateGithubImplementation {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }
    
    async execute(createGithubImplementation: CreateGithubImplementationDto): Promise<ImplementationEntity> {
        const { code, userId } = createGithubImplementation;

        try {
            
            const { access_token, refresh_token } = await GithubAdapter.getTokenByCode(code);
            const { login: ghUsername }  = await GithubAdapter.getUserData(access_token);
            
            const implementation = await this.implementationRepository.create({
                userId: userId,
                service: 'github',
                accessToken: access_token,
                refreshToken: refresh_token,
                username: ghUsername
            });
            
            return implementation;
            
        } catch (error) {
            throw error  
        }
    }
}