import { ImplementationsModule } from "./implementations/module";
import { ServicesModule } from "./services/module";
import { AuthModule } from "./auth/module";

// Gateways
import { GithubGatewayModule } from "./gateways";

export const modules = [AuthModule, ImplementationsModule, ServicesModule, GithubGatewayModule];