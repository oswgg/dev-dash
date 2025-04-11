import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ImplementationRepository, UserRepository } from "../../../domain/repositories";
import { MongoImplementationDataSourceImpl, MongoUserDataSourceImpls } from "../../../infrastructure/datasources";
import { ImplementationRepositoryImpl } from "../../../infrastructure/repositories";
import { GithubWebhookMiddleware } from "../../middlewares/gh-webhook.middleware";

@Module({
    controllers: [ServicesController],
    providers: [
        {
            provide: 'IMPLEMENTATION_DATASOURCE',
            useFactory: () => new MongoImplementationDataSourceImpl()
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
        GithubWebhookMiddleware,
        AuthMiddleware
    ]
})
export class ServicesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('services/github/events')
            .forRoutes('services');
            
        consumer
            .apply(GithubWebhookMiddleware)
            .forRoutes('services/github/events');
    }
} 