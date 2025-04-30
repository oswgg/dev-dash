import { Provider } from "@nestjs/common";
import { BcryptAdapter } from "../../../config/bcrypt";
import { JwtAdapter } from "../../../config/jwt";
import { COMPARE_PASSWORD, COMPARE_TOKEN, HASH_PASSWORD } from "../tokens";

export const CryptProviders: Provider[] = [
    {
        provide: HASH_PASSWORD,
        useValue: BcryptAdapter.hash
    },
    {
        provide: COMPARE_PASSWORD,
        useValue: BcryptAdapter.compare
    },
    {
        provide: COMPARE_TOKEN,
        useValue: JwtAdapter.compare
    }
];