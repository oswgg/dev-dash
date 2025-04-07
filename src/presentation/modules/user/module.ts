import { Module } from "@nestjs/common";
import { UserController } from "./user.controller"
import { UserRepository } from "../../../domain/repositories";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user.repository.impl";
import { MongoUserDataSourceImpls } from "../../../infrastructure/datasources/mongo.user.datasource.impls";



@Module({
    controllers: [UserController],
    providers: [
        {
            provide: 'USER_DATASOURCE',
            useFactory(...args) {
               return new MongoUserDataSourceImpls();
            },
        },
        {
            provide: UserRepository,
            useFactory: (dataSource) => new UserRepositoryImpl(dataSource),
            inject: ['USER_DATASOURCE']
        }
    ]
})
export class UserModule {}
