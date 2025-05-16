import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller"
import { UserProviders } from "../../../infrastructure/di/providers";
import { IGcpAdpater, GcpAdapter } from "../../../config/googleapi";
import { REGISTER_USER, RegisterUser } from "../../../domain/use-cases/user";
import { LOGIN_WITH_OAUTH, LoginWithOAuth } from "../../../domain/use-cases/user/login-oauth.use-case";



@Module({
    controllers: [AuthController],
    providers: [
        ...UserProviders,
        {
            provide: LOGIN_WITH_OAUTH,
            useClass: LoginWithOAuth,
        },
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
