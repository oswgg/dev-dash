import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../../domain/use-cases/user/auth-user.use-case";
import { UserRepository } from "../../domain/repositories";
import { UserMapper } from "../../infrastructure/mappers";




@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const auth = req.headers.authorization as string;
        if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid authorization header' });
        const token = auth.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token is missing' });

        new AuthUser(this.userRepository).execute({ token })
            .then(user => {
                req.user = UserMapper.noPassword(user);
                next();
            })
            .catch(error => {
                res.status(401).json({ error: error.message });
            });

        
    }
}