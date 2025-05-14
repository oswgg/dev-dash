import { Inject, Injectable, NestMiddleware, UseFilters } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../../domain/use-cases/user/auth-user.use-case";
import { UserRepository } from "../../domain/repositories";
import { UserMapper } from "../../infrastructure/mappers";
import { USER_REPOSITORY } from "../../infrastructure/di/tokens";
import { UnauthorizedException } from "../../domain/errors/errors.custom";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.extractToken(req);
        
        if (!token) {
            return next(new UnauthorizedException('Missing Token', 'Token is required for authentication'));
        }
        
        const user = await new AuthUser(this.userRepository).execute(token);
        req.user = UserMapper.noPassword(user);
        next();
    }

    private extractToken(req: Request): string | null {
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