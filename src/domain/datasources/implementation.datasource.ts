import { CreateImplementationDto } from "../dtos/implementation";
import { ImplementationEntity } from "../entities";




export abstract class ImplementationDataSource {
    abstract create(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity>;
}