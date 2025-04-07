import bcrypt from "bcrypt";

export type hashFunction = (password: string) => Promise<string>;


export class BcryptAdapter {

    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}