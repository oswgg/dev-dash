import { Module } from "@nestjs/common";
import { modules } from "./presentation/modules";

@Module({
    imports: modules,
})
export class AppModule {}