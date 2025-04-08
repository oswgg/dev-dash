import  jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";


const JWT_SECRET = envs.JWT_SECRET;

export type SignTokenFunction = (payload: Object, duration?: SignOptions['expiresIn']) => Promise<string|null>;
export type CompareTokenFunction = (token: string) => Promise<any>;
 
export class JwtAdapter {
    static sign(
        payload: Object,
        duration: SignOptions['expiresIn'] = 60 * 60 * 24 * 30
    ): Promise<string|null> {

        return new Promise(resolve => {

            const options: SignOptions = {
                expiresIn: duration 
            }
            
            jwt.sign(payload, JWT_SECRET, options, (err, token) => {
                if (err) resolve(null);
                
                resolve(token!);
            });
        });
    }
    
    static async compare(token: string): Promise<any> {

        return new Promise(resolve => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) resolve(null);
                
                resolve(decoded);
            });
        })
    }
}