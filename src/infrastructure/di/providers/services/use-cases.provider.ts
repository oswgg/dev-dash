import { Provider } from "@nestjs/common";
import { GetMondayDashboard } from "../../../../domain/use-cases/services/monday/get-dashboard.use-case";
import { MONDAY_API } from "../../../../domain/services/moday-api.service";
import { MondayAdapter } from "../../../../config/monday";




export const ServiceUseCasesProviders: Provider[] =  [
    {
        provide: MONDAY_API,
        useClass: MondayAdapter
    },
    GetMondayDashboard,
]