import { Inject } from "@nestjs/common";
import { IMPLEMENTATION_REPOSITORY } from "../../../../infrastructure/di/tokens";
import { ImplementationRepository } from "../../../repositories";
import { MONDAY_API, MondayApi } from "../../../services/moday-api.service";
import { MondayTaskEntity } from "../../../entities";




export class GetMondayDashboard {
    constructor(
        @Inject(IMPLEMENTATION_REPOSITORY) private readonly implementationRepository: ImplementationRepository,
        @Inject(MONDAY_API) private readonly mondayApiFactory: MondayApi
    ) { }
    
    async execute(userId: any): Promise<MondayTaskEntity[]> {
        const implementation = await this.implementationRepository.getOne({ userId, service: 'monday' });
        
        if (!implementation) throw new Error('User has no monday implementation');

       const apiMonday = this.mondayApiFactory.create(implementation.accessToken);
       

        
        return await apiMonday.getDashboard();
    }
}