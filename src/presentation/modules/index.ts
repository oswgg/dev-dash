import { ImplementationsModule } from "./implementations/module";
import { ServicesModule } from "./services/module";
import { UserModule } from "./user/module";

// Gateways
import { GithubGatewayModule } from "./gateways";

export const modules = [UserModule, ImplementationsModule, ServicesModule, GithubGatewayModule];