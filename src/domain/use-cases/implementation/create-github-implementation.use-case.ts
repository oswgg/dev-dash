import { envs } from "../../../config/envs";
import { CreateGithubImplementationDto } from "../../dtos/implementation";
import { ImplementationEntity } from "../../entities";
import { ImplementationRepository } from "../../repositories";


const GITHUB_CLIENT_ID = envs.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = envs.GITHUB_CLIENT_SECRET;


export class CreateGithubImplementation {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }
    
    async execute(createGithubImplementation: CreateGithubImplementationDto): Promise<ImplementationEntity> {
        const { code, userId, username } = createGithubImplementation;

        try {

            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: new URLSearchParams({
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code: code as string
                })
            })
            
            const { access_token } = await response.json();
            
            const implementation = await this.implementationRepository.create({
                userId: userId,
                service: 'github',
                accessToken: access_token,
                username: username
            });
            
            return implementation;
            
        } catch (error) {
            throw error  
        }
    }
}