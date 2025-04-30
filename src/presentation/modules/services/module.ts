import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { GithubWebhookMiddleware } from "../../middlewares/gh-webhook.middleware";
import { GithubPrEvent } from "../../../domain/use-cases/services/github/pr-event.use-case";
import { GithubGateway } from "../gateways/gtihub/github.gateway";
import { ImplementationProviders, UserProviders } from "../../../infrastructure/di/providers";
import { IMPLEMENTATION_DATASOURCE } from "../../../infrastructure/di/tokens";

@Module({
    controllers: [ServicesController],
    providers: [
        ...ImplementationProviders,
        ...UserProviders,
        {
            provide: 'GITHUB_NOTIFICATIONS_SERVICE',
            useClass: GithubGateway
        },
        {
            provide: GithubPrEvent,
            useFactory: (gateway, implRepo) => new GithubPrEvent(gateway, implRepo),
            inject: ['GITHUB_NOTIFICATIONS_SERVICE', IMPLEMENTATION_DATASOURCE]
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