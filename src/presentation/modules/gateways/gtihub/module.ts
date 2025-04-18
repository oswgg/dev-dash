import { Module } from "@nestjs/common";
import { GithubGateway } from "./github.gateway";




@Module({
    providers: [GithubGateway]
})
export class GithubGatewayModule { }