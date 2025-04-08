import { CreateImplementationDto } from "../dtos/implementation";
import { ImplementationEntity } from "../entities";




export abstract class ImplementationRepository {
    abstract create(implementation: CreateImplementationDto): Promise<ImplementationEntity>
}