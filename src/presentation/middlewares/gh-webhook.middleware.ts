import { envs } from "../../config/envs";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { CryptoAdapter } from "../../config/crypt";
import { NextFunction, Request, Response } from "express";


const ghWebhookSecret: string = envs.GITHUB_WEBHOOK_SECRET

@Injectable()
export class GithubWebhookMiddleware implements NestMiddleware {
    constructor(
    ) { } 

    use(req: Request, res: Response, next: NextFunction) {
        const signature = req.headers['x-hub-signature-256'] as string;

        if (!signature) return res.status(401).send('No signature found in request'); 
        
        const hmac = CryptoAdapter.createHmac('sha256', ghWebhookSecret);
        hmac.update(JSON.stringify(req.body));
        const calculatedSignature = 'sha256=' + hmac.digest('hex');
        
        if (CryptoAdapter.safeCompare(calculatedSignature, signature))  {
            next();
        }  else {
            return res.status(401).send('Signatures verification failed');
        }
    }
}