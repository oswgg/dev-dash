import { Inject } from "@nestjs/common";
import { IMPLEMENTATION_REPOSITORY } from "../../../../infrastructure/di/tokens";
import { ImplementationRepository } from "../../../repositories";
import { MONDAY_API, MondayApi } from "../../../services/moday-api.service";
import { MondayTaskEntity } from "../../../entities";
import { CustomError } from "../../../errors/errors.custom";
import { MondayUserEntity } from "../../../entities/monday-user.entity";




export class GetMondayDashboard {
    constructor(
        @Inject(IMPLEMENTATION_REPOSITORY) private readonly implementationRepository: ImplementationRepository,
        @Inject(MONDAY_API) private readonly mondayApiFactory: MondayApi
    ) { }
    
    async execute(userId: any): Promise<{user: MondayUserEntity, tasks:MondayTaskEntity[]}> {
        const implementation = await this.implementationRepository.getOne({ userId, service: 'monday' });
        
        if (!implementation) throw CustomError.forbidden('User has no monday implementation');

        const mondayApi = this.mondayApiFactory.create(implementation.accessToken);
       
        const tasks = await mondayApi.getUserTasks();
        const user = await mondayApi.getUserData();

        return {
            user,
            tasks
        }
    }
}