import { Inject } from "@nestjs/common";
import { ImplementationDataSource } from "../../domain/datasources";
import { CreateImplementationDto } from "../../domain/dtos/implementation";
import { ImplementationEntity } from "../../domain/entities";
import { ImplementationRepository } from "../../domain/repositories/implementation.repository";
import { QueryFilter, QueryUpdate } from "../../types/filter.types";
import { IMPLEMENTATION_DATASOURCE } from "../di/tokens";




export class ImplementationRepositoryImpl implements ImplementationRepository { 
    constructor(
        @Inject(IMPLEMENTATION_DATASOURCE)
        private readonly implementationDataSource: ImplementationDataSource
    ) { }
    
    async create(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity> {
        return this.implementationDataSource.create(createImplementationDto);
    }
    
    async getAll(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity[]> {
        return this.implementationDataSource.getAll(filters);
    }
    
    async getOne(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity | null> {
        return this.implementationDataSource.getOne(filters);
    }
    
    async getById(id: any): Promise<ImplementationEntity | null> {
        return this.implementationDataSource.getById(id);
    }
    
    async update(query: QueryUpdate<ImplementationEntity>): Promise<ImplementationEntity | null> {
        return this.implementationDataSource.update(query);
    }
} 