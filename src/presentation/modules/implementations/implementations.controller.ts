import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { envs } from "../../../config/envs";
import { ImplementationRepository } from "../../../domain/repositories";
import { CreateImplementation } from "../../../domain/use-cases/implementation";

const GITHUB_CLIENT_ID = envs.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = envs.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = envs.GITHUB_REDIRECT_URI;


@Controller('implementations')
export class ImplementationsController {
    
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }

    @Get('github')
    async github(@Res() res: Response): Promise<void> {
        const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=read:user repo`;
        res.redirect(url);
    }
    
    @Get('github/callback')
    async githubCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
        const { code } = req.query;
        if (!code) return res.status(400).json({ error: 'Code is missing' });
        
        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: new URLSearchParams({
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code: code as string
                })
            })
            
            const { access_token } = await response.json();
            
            const user = req.user!;
            
            new CreateImplementation(this.implementationRepository).execute({
                userId: user.id,
                service: 'github',
                accessToken: access_token,
                username: user.name,
                enabled: true
            })
            .then(implementation => {
                res.status(200).json({ implementation });
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Github callback error' });
        }
    }
}