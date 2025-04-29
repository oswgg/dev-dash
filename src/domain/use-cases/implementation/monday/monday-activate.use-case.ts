import { MondayAdapter } from "../../../../config/monday";
import { CreateMondayImplementationDto } from "../../../dtos/implementation/create-monday-implementation.dto";
import { ImplementationEntity } from "../../../entities";
import { ImplementationRepository } from "../../../repositories";





export class ActivateMonday {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { } 
    
    async execute(activateMondayDTO: CreateMondayImplementationDto): Promise<ImplementationEntity> {
        const { code, userId } = activateMondayDTO;
        
        
        const { access_token, token_type } = await MondayAdapter.getTokenByCode(code);
        
        const userData = await MondayAdapter.getUserData(access_token);
        const { data: { me: { id, name } } } = userData;

        const implementation = await this.implementationRepository.create({
            userId: userId,
            service: 'monday',
            accessToken: access_token,
            refreshToken: null,
            username: name
        });
        
        return implementation;
    }
}