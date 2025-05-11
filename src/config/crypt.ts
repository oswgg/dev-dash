import * as crypto from "crypto";




export class CryptoAdapter {
    
    static createHmac(algorithm: string, key: string): crypto.Hmac {
        return crypto.createHmac(algorithm, key);
    }
    
    static safeCompare(a: string, b: string): boolean {
        if (a.length !== b.length) return false;
        
        return crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        );
        
    }
    
    static createRandomString(length: number, charset: 'hex' | 'base64' | 'binary' | 'ascii' = 'hex'): string {
        return crypto.randomBytes(length).toString(charset);
    }
}
