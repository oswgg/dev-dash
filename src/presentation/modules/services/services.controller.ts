import { Controller, Get, Param, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { ImplementationModel, UserModel } from "../../../data/mongoose/models";





@Controller('services')
export class ServicesController {
    
    constructor() { }
    
    @Get(':service/notifications')
    async getNotifications(
        @Param('service') service: string,
        @Req() req: Request,
        @Res() res: Response): Promise<any> {
            
        console.log(service)
        console.log(req.user)
        
        const { Octokit } = await import('@octokit/rest')
        const implementaition = await ImplementationModel.findOne({ service: 'github' })

        const client = new Octokit({
            auth: implementaition?.accessToken
        });
        
        console.log(await client.pulls.list({
            owner: 'oswgg',
            repo: 'dev-dash',
            state: 'all'
        }))
        

        

        return res.status(200).json({ message: 'Notifications for ' + service });
        
    }
}