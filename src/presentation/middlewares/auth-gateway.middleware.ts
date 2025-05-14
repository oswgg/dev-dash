import { Socket } from "socket.io";
import { BadRequestException, UnauthorizedException } from "../../domain/errors/errors.custom";
import { CompareTokenFunction, JwtAdapter } from "../../config/jwt";




export class AuthGatewayMiddleware {

    static compareToken: CompareTokenFunction = JwtAdapter.compare;

    static async use(socket: Socket, next: any) {
        const token = socket.handshake?.auth?.token;
        if (!token) return next(new BadRequestException('Missing Token', 'Token is required for authentication'));

        const decoded: { id: any } = await JwtAdapter.compare(token);

        if (!decoded) return next(new UnauthorizedException('Invalid Token', 'Authentication token is invalid'));
        if (!decoded.id) return next(new UnauthorizedException('Invalid Token', 'Authentication token is invalid'));

        socket = Object.assign(socket, { user: { id: decoded.id } });
        next();
    }
}