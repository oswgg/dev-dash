import { Controller, Get, Param, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { ImplementationModel, UserModel } from "../../../data/mongoose/models";





@Controller('services')
export class ServicesController {
    
    constructor() { }
    
    @Get('github/pull-requests')
    async getNotifications(
        @Param('service') service: string,
        @Req() req: Request,
        @Res() res: Response): Promise<any> {
        

        
    }
}