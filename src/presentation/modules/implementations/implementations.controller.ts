import { Controller, Get, Inject, Param, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { envs } from "../../../config/envs";
import { ImplementationRepository } from "../../../domain/repositories";
import { CreateGithubImplementation, GetActiveImplementations } from "../../../domain/use-cases/implementation";
import { ImplementationService } from "../../../data/mongoose/models";
import { CreateMondayImplementationDto } from "../../../domain/dtos/implementation/create-monday-implementation.dto";
import { ActivateMonday } from "../../../domain/use-cases/implementation/monday/monday-activate.use-case";
import { IMPLEMENTATION_REPOSITORY } from "../../../infrastructure/di/tokens";

const GITHUB_CLIENT_ID = envs.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = envs.GITHUB_REDIRECT_URI;
const MONDAY_CLIENT_ID = envs.MONDAY_CLIENT_ID;


@Controller('implementations')
export class ImplementationsController {
    
    constructor(
        @Inject(IMPLEMENTATION_REPOSITORY)
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

    @Get('monday/activate')
    async monday(
        @Res() res: Response,
        @Req() req: Request
    ): Promise<void> {
        const { returnTo, token } = req.query;
        const state = JSON.stringify({ returnTo, token });
        const encodedState = encodeURIComponent(state);
        const scope = encodeURIComponent('boards:read items:read');

        const url = `https://auth.monday.com/oauth2/authorize?client_id=${MONDAY_CLIENT_ID}&scop=${scope}&state=${encodedState}&developer_mode=true`;

        res.redirect(url);
    }
    
    @Get('monday/callback')
    async mondayCallback(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<any> {
        const { code, state } = req.query;
        const decodedState = decodeURIComponent(state as string);
        const { returnTo } = JSON.parse(decodedState);
        
        if (!code) return res.status(400).json({ error: 'Code is missing' });
        
        const user = req.user!;
        
        try {
            const [error, activateMondayDTO] = CreateMondayImplementationDto.create({ code: code as string, userId: user.id });
            if (error) return res.status(400).json({ error: error });
            
            const implementation = await new ActivateMonday(this.implementationRepository).execute(activateMondayDTO!);
            
            res.redirect(`${returnTo}?success=true`);
        } catch (error: any) {
            res.redirect(`${returnTo}?success=false`);
        }
        
    }
}