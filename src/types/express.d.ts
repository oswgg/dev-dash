import { UserEntity } from "../domain/entities";


export declare global {
    namespace Express {
        interface Request {
            user?: Omit<UserEntity, 'password'>;
        }
    }
}   

export { };