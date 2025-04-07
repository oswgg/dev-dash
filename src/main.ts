import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";
import { MongoDatabase } from "./data/mongoose/mongo-database";
import { envs } from "./config/envs";

async function bootstrap() {
    await MongoDatabase.connect({
        mongoURL: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });
    
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();