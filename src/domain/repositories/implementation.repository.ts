import { QueryFilter, QueryUpdate } from "../../types/filter.types";
import { CreateImplementationDto } from "../dtos/implementation";
import { ImplementationEntity } from "../entities";




export abstract class ImplementationRepository {
    abstract create(implementation: CreateImplementationDto): Promise<ImplementationEntity>
    abstract getAll(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity[]>
    abstract getOne(filters: QueryFilter<ImplementationEntity>[] | Partial<ImplementationEntity>): Promise<ImplementationEntity | null>
    abstract getById(id: any): Promise<ImplementationEntity | null>
    abstract update(query: QueryUpdate<ImplementationEntity>): Promise<ImplementationEntity | null>
}