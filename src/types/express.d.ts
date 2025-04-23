import { UserEntity } from "../domain/entities";
import { Socket } from "socket.io";


declare module "socket.io" {
    interface Socket {
        user?: { id: string };
    }
}

export declare global {
    namespace Express {
        interface Request {
            user?: Omit<UserEntity, 'password'>;
        }
    }
}   


export { };