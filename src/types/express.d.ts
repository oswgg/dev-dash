import { UserEntity } from "../domain/entities";
import { Socket } from "socket.io";
import * as express from "express";
import * as session from "express-session";


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

interface oAuthSession extends session.Session {
    oauthState: {
        sessionId: string;
        timestamp: number;
        used: boolean;
    };
}

export interface RequestWithSession extends express.Request {
    session: oAuthSession;
}

export { };