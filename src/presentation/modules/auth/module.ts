import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller"
import { UserProviders } from "../../../infrastructure/di/providers";
import { IGcpAdpater, GcpAdapter } from "../../../config/googleapi";
import { REGISTER_USER, RegisterUser } from "../../../domain/use-cases/user";



@Module({
    controllers: [AuthController],
    providers: [
        ...UserProviders,
        {
            provide: REGISTER_USER,
            useClass: RegisterUser,
        },
        {
            provide: IGcpAdpater,
            useClass: GcpAdapter
        }
    ]
})
export class AuthModule {}
