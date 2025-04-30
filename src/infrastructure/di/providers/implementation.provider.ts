import { Provider } from "@nestjs/common";
import { IMPLEMENTATION_DATASOURCE, IMPLEMENTATION_REPOSITORY } from "../../di/tokens";
import { MongoImplementationDataSourceImpl } from "../../datasources";
import { ImplementationRepositoryImpl } from "../../repositories";





export const ImplementationProviders: Provider[] = [
    {
        provide: IMPLEMENTATION_DATASOURCE,
        useClass: MongoImplementationDataSourceImpl
    },
    {
        provide: IMPLEMENTATION_REPOSITORY,
        useClass: ImplementationRepositoryImpl
    },
];