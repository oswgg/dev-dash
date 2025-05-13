import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";
import { MongoDatabase } from "./data/mongoose/mongo-database";
import { envs } from "./config/envs";
import session from "express-session";
import { HttpExceptionMiddleware } from "./presentation/middlewares/http-exceptions.middleware";
import { CatchEveryExceptionMiddleware } from "./presentation/middlewares/catch-every-exception.middleware";

async function bootstrap() {
    await MongoDatabase.connect({
        mongoURL: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });
    
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true
    });
    app.use(session({
        secret: envs.SESSIONS_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
            httpOnly: true
        }
    }));
    app.useGlobalFilters(new CatchEveryExceptionMiddleware(), new HttpExceptionMiddleware());
    await app.listen(3000);
}
bootstrap();