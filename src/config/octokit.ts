import { Octokit } from '@octokit/rest';
import { PullRequestMapper } from '../infrastructure/mappers';
import { PullRequestEntity } from '../domain/entities';
import { Logger } from '@nestjs/common';
import { ImplementationRepository } from '../domain/repositories';
import { RenewGithubToken } from '../domain/use-cases/implementation/renew-github.token.use-case';

export interface IOctokitAdapter {
    getPullRequests(
        config: { [key: string]: any }, implementationRepository: ImplementationRepository): Promise<PullRequestEntity[] | null>;
}

export type OctokitAdapterConstructor = new (accessToken: string, userId: string) => IOctokitAdapter;

export async function getOctokitAdapter(): Promise<OctokitAdapterConstructor> {

    const { Octokit } = await import('@octokit/rest');

    return class OctokitAdapter implements IOctokitAdapter {
        private client: Octokit;
        private logger: Logger;

        constructor(accessToken: string, private userId: string) {
            this.client = new Octokit({
                auth: accessToken
            });
            this.logger = new Logger('OctokitAdapter');
        }

        async getPullRequests(
            config:  { [key: string]: any },
            implementationRepository: ImplementationRepository
        ): Promise<PullRequestEntity[] | null> {
            try {
                const response = await this.client.request('GET /search/issues', {
                    q: config.query,
                    advanced_search: 'true',
                });
                
                return PullRequestMapper.fromOctokitToEntities(response.data.items);
            } catch (error: any) {
                if (error.status === 401) { 
                    this.logger.warn('Authentication failed, attempting token renewal');

                    const renewTokenUseCase = new RenewGithubToken(implementationRepository);
                    const impl = await renewTokenUseCase.execute(this.userId);
                    
                    if (!impl) {
                        this.logger.error('Failed to renew github token');
                        throw new Error('Internal Server Error');
                    }

                    this.client = new Octokit({
                        auth: impl.accessToken
                    });
                    
                    this.logger.log('Successfully renewed github token');
                    return this.getPullRequests(config, implementationRepository);
                }
                
                this.logger.error(error);
                return null;
            }
        }
    }
}
