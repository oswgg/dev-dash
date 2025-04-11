import { ImplementationModel } from "../../data/mongoose/models";
import { ImplementationDataSource } from "../../domain/datasources";
import { CreateImplementationDto } from "../../domain/dtos/implementation";
import { ImplementationEntity } from "../../domain/entities";
import { isQueryFilter, QueryFilter } from "../../types/filter.types";
import { ImplementationMapper } from "../mappers/implementation.mapper";




export class MongoImplementationDataSourceImpl implements ImplementationDataSource {

    constructor() { }

    async create(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity> {
        const { userId, service, accessToken, username } = createImplementationDto;

        try {

            const userHasImplementation = await ImplementationModel.findOne({ userId, service });
            if (userHasImplementation) throw new Error(`User already has ${service} implementation`);

            const implementation = await ImplementationModel.create({
                userId,
                service,
                accessToken,
                username,
                enabled: true
            });

            return ImplementationMapper.fromObjectToEntity(implementation);
        } catch (error) {
            throw error;
        }
    }

    async getAll(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity[] | null> {
        if (isQueryFilter(filters)) {
            // Todo: implementar una funcion que transforme el array de queryfilter en un objeto de mongoose
            return null;
        }

        const implementations = await ImplementationModel.find(filters);

        if (implementations.length > 0) {
            return implementations.map(ImplementationMapper.fromObjectToEntity);
        }

        return null;
    }
    
    async getOne(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity | null> {
        if (isQueryFilter(filters)) {
            // Todo: implementar una funcion que transforme el array de queryfilter en un objeto de mongoose
            return null;
        }

        const implementation = await ImplementationModel.findOne(filters);

        if (implementation) {
            return ImplementationMapper.fromObjectToEntity(implementation);
        }

        return null;
    }


    async getById(id: any): Promise<ImplementationEntity | null> {
        return null;
    }
}