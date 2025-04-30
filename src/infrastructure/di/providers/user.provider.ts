import { Provider } from "@nestjs/common";
import { USER_DATASOURCE, USER_REPOSITORY } from "../tokens";
import { MongoUserDataSourceImpls } from "../../datasources";
import { UserRepositoryImpl } from "../../repositories";
import { CryptProviders } from "./crypto.provider";





export const UserProviders: Provider[] = [
    ...CryptProviders,
    {
        provide: USER_DATASOURCE,
        useClass: MongoUserDataSourceImpls
    },
    {
        provide: USER_REPOSITORY,
        useClass: UserRepositoryImpl
    }
];