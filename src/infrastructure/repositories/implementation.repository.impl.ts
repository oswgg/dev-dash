import { ImplementationDataSource } from "../../domain/datasources";
import { CreateImplementationDto } from "../../domain/dtos/implementation";
import { ImplementationEntity } from "../../domain/entities";
import { ImplementationRepository } from "../../domain/repositories/implementation.repository";
import { MongoImplementationDataSourceImpl } from "../datasources/mongo.implementation.datasource.impl";





export class ImplementationRepositoryImpl implements ImplementationRepository { 
    constructor(
        private readonly implementationDataSource: ImplementationDataSource
    ) { }
    
    async create(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity> {
        return this.implementationDataSource.create(createImplementationDto);
    }
} 