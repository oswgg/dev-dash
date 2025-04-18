import { ImplementationService } from "../../../data/mongoose/models";
import { ImplementationEntity } from "../../entities";
import { ImplementationRepository } from "../../repositories";





export class GetActiveImplementations {
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }

    async execute(userId: any, implementation?: ImplementationService): Promise<ImplementationEntity[] | ImplementationEntity | null> {
        if (!implementation) {
            return this.implementationRepository.getAll({
                userId: userId,
                enabled: true,
            });
        }

        return this.implementationRepository.getOne({
            userId: userId,
            service: implementation,
            enabled: true
        });
    }
}