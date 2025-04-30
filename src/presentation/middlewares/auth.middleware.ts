import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../../domain/use-cases/user/auth-user.use-case";
import { UserRepository } from "../../domain/repositories";
import { UserMapper } from "../../infrastructure/mappers";
import { USER_REPOSITORY } from "../../infrastructure/di/tokens";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = this.extractToken(req);
            
            if (!token) {
                return res.status(401).json({ error: 'Authentication token required' });
            }

            const user = await new AuthUser(this.userRepository).execute({ token });
            req.user = UserMapper.noPassword(user);
            next();
        } catch (error) {
            return res.status(401).json({ 
                error: 'Authentication failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private extractToken(req: Request): string | null {
        // Check header authorization (most secure)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            return authHeader.split(' ')[1];
        }

        const tokenFromQuery = req.query.token as string | undefined;
        if (tokenFromQuery) {
            return tokenFromQuery;
        }

        const encodedState = req.query.state as string | undefined;
        if (encodedState) {
            try {
                const decodedState = decodeURIComponent(encodedState);
                const parsedState = JSON.parse(decodedState);
                if (parsedState && typeof parsedState === 'object' && 'token' in parsedState) {
                    return parsedState.token;
                }
            } catch (error) {
                // If there's an error parsing the state, just continue to the next method
                // This avoids exposing parsing errors to potential attackers
            }
        }

        return null;
    }
}