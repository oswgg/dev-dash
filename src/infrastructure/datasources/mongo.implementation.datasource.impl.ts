import { ImplementationModel } from "../../data/mongoose/models";
import { ImplementationDataSource } from "../../domain/datasources";
import { CreateImplementationDto } from "../../domain/dtos/implementation";
import { ImplementationEntity } from "../../domain/entities";
import { ImplementationMapper } from "../mappers/implementation.mapper";




export class MongoImplementationDataSourceImpl implements ImplementationDataSource {
    
    constructor() { }

    async create(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity> {
        const { userId, service, accessToken, username, enabled } = createImplementationDto;
        try {
            
            const userHasImplementation = await ImplementationModel.findOne({ userId, service });
            if (userHasImplementation) throw new Error(`User already has ${service} implementation`);
            
            const implementation = await ImplementationModel.create({
                userId,
                service,
                accessToken,
                username,
                enabled
            });
            
            return ImplementationMapper.fromObjectToEntity(implementation);
        } catch (error) {
            throw error;
        }
    }
}