import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import { PullRequestMapper } from '../infrastructure/mappers';
import { PullRequestEntity } from '../domain/entities';

export interface IOctokitAdapter {
    getPullRequests(
        config: { [key: string]: any }): Promise<PullRequestEntity[] | null>;
}

export type OctokitAdapterConstructor = new (accessToken: string) => IOctokitAdapter;

export async function getOctokitAdapter(): Promise<OctokitAdapterConstructor> {

    const { Octokit } = await import('@octokit/rest');

    return class OctokitAdapter implements IOctokitAdapter {
        private client: Octokit;

        constructor(accessToken: string) {
            this.client = new Octokit({
                auth: accessToken
            });
        }

        async getPullRequests(
            config:  { [key: string]: any } 
        ): Promise<PullRequestEntity[] | null> {
            return this.client.request('GET /search/issues', {
                q: config.query,
                advanced_search: 'true'
            })
            .then(res => {
                return PullRequestMapper.fromOctokitToEntities(res.data.items);
            })
            .catch(err => {
                return null;
            });
        }
    }
}
