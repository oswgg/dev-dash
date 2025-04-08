import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ImplementationsController } from "./implementations.controller";
import { ImplementationRepository } from "../../../domain/repositories";
import { MongoImplementationDataSourceImpl, MongoUserDataSourceImpls } from "../../../infrastructure/datasources";
import { ImplementationRepositoryImpl } from "../../../infrastructure/repositories";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRepository } from "../../../domain/repositories";




@Module({
    controllers: [ImplementationsController],
    providers: [
        {
           provide: 'IMPLEMENTATION_DATASOURCE', 
           useFactory: () =>  new MongoImplementationDataSourceImpl()
        },
        {
            provide: ImplementationRepository,
            useFactory: (dataSource) => new ImplementationRepositoryImpl(dataSource),
            inject: ['IMPLEMENTATION_DATASOURCE']
        },
        {
            provide: UserRepository,
            useClass: MongoUserDataSourceImpls
        },
        AuthMiddleware
    ]
})
export class ImplementationsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes('implementations');
    }
 }