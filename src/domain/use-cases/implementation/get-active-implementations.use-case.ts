import { ImplementationService } from "../../../data/mongoose/models";
import { ImplementationEntity } from "../../entities";
import { ImplementationRepository } from "../../repositories";





export class GetActiveImplementations {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }

    async execute(implementation?: ImplementationService): Promise<ImplementationEntity[] | ImplementationEntity | null> {
        if (!implementation) {
            return this.implementationRepository.getAll({
                enabled: true
            });
        }

        return this.implementationRepository.getOne({
            service: implementation, enabled: true
        });
    }
}