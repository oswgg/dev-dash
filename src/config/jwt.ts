import  jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";


const JWT_SECRET = envs.JWT_SECRET;

export type SignTokenFunction = (payload: Object, duration?: SignOptions['expiresIn']) => Promise<string|null>;
 
export class JwtAdapter {
    static sign(
        payload: Object,
        duration: SignOptions['expiresIn'] = 60 * 60 * 24 * 30
    ): Promise<string|null> {

        return new Promise(resolve => {

            const options: SignOptions = {
                expiresIn: duration 
            }
            
                console.log(payload)
            jwt.sign(payload, JWT_SECRET, options, (err, token) => {
                if (err) resolve(null);
                
                resolve(token!);
            });
        });
    }
}