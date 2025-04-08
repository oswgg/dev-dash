import { UserEntity } from "../domain/entities";


export declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}   

export { };