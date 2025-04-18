import { Controller, Post, Get, Param, Res, Req, Body } from "@nestjs/common";
import { Request, Response } from "express";
import { GithubGetPullRequest } from "../../../domain/use-cases/services/github";
import { ImplementationRepository } from "../../../domain/repositories";
import { GithubPrEvent } from "../../../domain/use-cases/services/github/pr-event.use-case";
import { PullRequestEventDto } from "../../../domain/dtos/services/github/pull-request-event.dto";





@Controller('services')
export class ServicesController {
    
    constructor(
        private readonly implemetationsRepository: ImplementationRepository,
        private readonly ghPrEventUseCase: GithubPrEvent
    ) { }
    
    @Get('github/pull-requests')
    async getNotifications(
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
        @Body() body: any,
        @Res() res: Response): Promise<any> {
            
        const event = req.headers['x-github-event'] as string;
        
        if (event === 'pull_request') { 
            const { action, pull_request } = body;
            const ghPullRequestEventDto = PullRequestEventDto.create(action, pull_request);

            this.ghPrEventUseCase.execute(ghPullRequestEventDto)
                .then(() => { 
                    res.status(200).json({ message: 'ok' }); 
                })
                .catch(error => { 
                    res.status(400).json({ error: error.message }); 
                });
        }
    }
   
}