import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ImplementationRepository, UserRepository } from "../../../domain/repositories";
import { MongoImplementationDataSourceImpl, MongoUserDataSourceImpls } from "../../../infrastructure/datasources";
import { ImplementationRepositoryImpl } from "../../../infrastructure/repositories";
import { GithubWebhookMiddleware } from "../../middlewares/gh-webhook.middleware";
import { GithubPrEvent } from "../../../domain/use-cases/services/github/pr-event.use-case";
import { GithubGateway } from "../gateways/gtihub/github.gateway";

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
        {
            provide: 'GITHUB_NOTIFICATIONS_SERVICE',
            useClass: GithubGateway
        },
        {
            provide: GithubPrEvent,
            useFactory: (gateway, implRepo) => new GithubPrEvent(gateway, implRepo),
            inject: ['GITHUB_NOTIFICATIONS_SERVICE', 'IMPLEMENTATION_DATASOURCE']
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