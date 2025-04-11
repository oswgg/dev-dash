import { Controller, Post, Get, Param, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { GithubGetPullRequest } from "../../../domain/use-cases/services/github";
import { ImplementationRepository } from "../../../domain/repositories";





@Controller('services')
export class ServicesController {
    
    constructor(
        private readonly implemetationsRepository: ImplementationRepository
    ) { }
    
    @Get('github/pull-requests')
    async getNotifications(
        @Param('service') service: string,
        @Req() req: Request,
        @Res() res: Response): Promise<any> {

            new GithubGetPullRequest(this.implemetationsRepository).execute(req.user!.id)
                .then(prs => {
                    res.json(prs);
                })
                .catch(error => {
                    res.status(400).json({ error: error.message });
                });
    }
    
    @Post('github/events')
    async githubEventHandler(
        @Req() req: Request,
        @Res() res: Response): Promise<any> {
            
        const event = req.headers['x-github-event'] as string;
        
        if (event === 'pull_request') { 
            
        }
    }
   
}