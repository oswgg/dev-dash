'use strict';

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ImplementationsController } from "./implementations.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ImplementationProviders, UserProviders } from "../../../infrastructure/di/providers";


@Module({
    controllers: [ImplementationsController],
    providers: [
        ...ImplementationProviders,
        ...UserProviders,
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