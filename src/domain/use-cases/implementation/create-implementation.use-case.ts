import { CreateImplementationDto } from "../../dtos/implementation";
import { ImplementationEntity } from "../../entities";
import { ImplementationRepository } from "../../repositories";




export class CreateImplementation {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }
    
    async execute(createImplementationDto: CreateImplementationDto): Promise<ImplementationEntity> {
        return this.implementationRepository.create(createImplementationDto);
    }
}