import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { envs } from "../../../config/envs";
import { ImplementationRepository } from "../../../domain/repositories";
import { CreateGithubImplementation, GetActiveImplementations } from "../../../domain/use-cases/implementation";
import { ImplementationService } from "../../../data/mongoose/models";

const GITHUB_CLIENT_ID = envs.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = envs.GITHUB_REDIRECT_URI;


@Controller('implementations')
export class ImplementationsController {
    
    constructor(
        private readonly implementationRepository: ImplementationRepository
    ) { }
    
    @Get()
    async getActiveImplementations(
        @Res() res: Response,
        @Req() req: Request
    ): Promise<any> {
        const user = req.user!;
        new GetActiveImplementations(this.implementationRepository).execute(user.id)
            .then(implementations => res.json(implementations))
            .catch(error => res.status(500).json({ error: error.message }));
    }
    
    @Get(':implementation')
    async isImplementationActive(
        @Param  ('implementation') implementation: ImplementationService,
        @Res() res: Response,
        @Req() req: Request
    ): Promise<any> {
        const user = req.user!;
        new GetActiveImplementations(this.implementationRepository).execute(user.id, implementation)
            .then(implementation =>  {
                if (implementation) {
                    return res.status(200).json({ active: true });
                }
                
                res.status(200).json({ active: false });
            })
            .catch(error => res.status(500).json({ error: error.message }));
    }

    @Get('github/activate')
    async github(
        @Res() res: Response,
        @Req() req: Request
    ): Promise<void> {
        const { returnTo, token } = req.query;
        const state = JSON.stringify({ returnTo, token });
        const encodedState = encodeURIComponent(state);
        const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=read:user repo&state=${encodedState}&token=${token}`;
        res.redirect(url);
    }
    
    @Get('github/callback')
    async githubCallback(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<any> {
        const { code, state } = req.query;
        const decodedState = decodeURIComponent(state as string);
        const { returnTo } = JSON.parse(decodedState);
    
        if (!code) return res.status(400).json({ error: 'Code is missing' });
    
        const user = req.user!;
        const redirectUrl = returnTo;
    
        try {
            const implementation = await new CreateGithubImplementation(this.implementationRepository).execute({
                code: code as string,
                userId: user.id,
                username: user.name
            });
    
            res.redirect(`${redirectUrl}?success=true`);
        } catch (error: any) {
            res.redirect(`${redirectUrl}?success=false`);
        }
    }
}