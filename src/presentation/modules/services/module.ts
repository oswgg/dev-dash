import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRepository } from "../../../domain/repositories";
import { MongoUserDataSourceImpls } from "../../../infrastructure/datasources";

@Module({
    controllers: [ServicesController],
    providers: [
        {
            provide: UserRepository,
            useClass: MongoUserDataSourceImpls
        },
        AuthMiddleware
    ]
})
export class ServicesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes('services');
    }
} 