import bcrypt from "bcrypt";

export type hashPasswordFunction = (password: string) => Promise<string>;
export type comparePasswordFunction = (password: string, hash: string) => Promise<boolean>;


export class BcryptAdapter {

    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    
    static async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}