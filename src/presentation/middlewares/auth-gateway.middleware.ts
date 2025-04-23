import { Socket } from "socket.io";
import { CustomError } from "../../domain/errors/errors.custom";
import { CompareTokenFunction, JwtAdapter } from "../../config/jwt";




export class AuthGatewayMiddleware {
    
    static compareToken: CompareTokenFunction = JwtAdapter.compare;

    static async use(socket: Socket, next: any) {
        const token = socket.handshake?.auth?.token;
        if (!token)  throw CustomError.badRequest('Authentication token required');
        
        const decoded: { id: any } = await JwtAdapter.compare(token);

        if (!decoded) return next(CustomError.unauthorized('Authentication token is invalid'));
        if (!decoded.id) return next(CustomError.unauthorized('Authentication token is invalid'));

        socket = Object.assign(socket, { user: { id: decoded.id } });
        next();
    }
}