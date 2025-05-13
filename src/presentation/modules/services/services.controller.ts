import { Controller, Post, Get, Param, Res, Req, Body, Inject } from "@nestjs/common";
import { Request, Response } from "express";
import { GithubGetPullRequest } from "../../../domain/use-cases/services";
import { ImplementationRepository } from "../../../domain/repositories";
import { GithubPrEvent } from "../../../domain/use-cases/services/github/pr-event.use-case";
import { PullRequestEventDto } from "../../../domain/dtos/services/github/pull-request-event.dto";
import { GithubGetPullRequestToReview } from "../../../domain/use-cases/services/github/get-prs-to-review.use-case";
import { IMPLEMENTATION_REPOSITORY } from "../../../infrastructure/di/tokens";
import { GetMondayDashboard } from "../../../domain/use-cases/services/monday/get-dashboard.use-case";
import { BadRequestException } from "../../../domain/errors/errors.custom";





@Controller('services')
export class ServicesController {
    
    constructor(
        @Inject(IMPLEMENTATION_REPOSITORY) private readonly implemetationsRepository: ImplementationRepository,
        @Inject(GetMondayDashboard) private readonly getMondayDashboard: GetMondayDashboard,
        private readonly ghPrEventUseCase: GithubPrEvent
    ) { }
    
    @Get('github/pull-requests')
    async getNotifications(
        @Req() req: Request,
       ): Promise<any> {
        return await new GithubGetPullRequest(this.implemetationsRepository).execute(req.user!.id);
    }
    
    @Get('github/pull-requests/to-review') 
    async getPullrequestsToReview(
        @Req() req: Request,
    ): Promise<any> {
        return await new GithubGetPullRequestToReview(this.implemetationsRepository).execute(req.user!.id);
    }
    
    @Post('github/events')
    async githubEventHandler(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: any,
    ): Promise<any> {
            
        const event = req.headers['x-github-event'] as string;
        
        if (event === 'pull_request') { 
            const { action, pull_request, sender } = body;
            const [ errors, ghPullRequestEventDto ] = PullRequestEventDto.create(action, pull_request);
            
            if (errors) throw new BadRequestException('Invalid Body', 'Some fields are invalid', errors);
            
            return await this.ghPrEventUseCase.execute(ghPullRequestEventDto!, sender);
        }
    }
   
    @Get('monday/tasks')
    async mondayDashboard(
        @Req() req: Request
    ): Promise<any> {
        return await this.getMondayDashboard.execute(req.user!.id);
    }
}