import { GithubAdapter } from "../../../../config/github";
import { ImplementationEntity } from "../../../entities";
import { ImplementationRepository } from "../../../repositories";
import { ForbiddenException, NotFoundException } from "../../../errors/errors.custom";





export class RenewGithubToken {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }
    
    async execute(userId: any): Promise<ImplementationEntity | null> {
        const ghImplementation = await this.implementationRepository.getOne({ userId, service: 'github' })
        if (!ghImplementation) throw new ForbiddenException('Forbidden', 'User has no github implementation');
        
        const { access_token, refresh_token } = await GithubAdapter.getTokenByRefreshToken(ghImplementation.refreshToken);
        
        const implementation = await this.implementationRepository.update({
            where: {
                userId,
                service: 'github',
            },
            updated: {
                accessToken: access_token,
                refreshToken: refresh_token
            }
        });
        
        if (!implementation) throw new NotFoundException('Not Found', 'Implementation not found');

        if (implementation.accessToken === ghImplementation.accessToken  // Tokens are the same
        && implementation.refreshToken === ghImplementation.refreshToken) return null;
        
        return implementation;
    }
}