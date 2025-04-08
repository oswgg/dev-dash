import { Controller, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";
import { RegisterUserDto } from "../../../domain/dtos/user"
import { RegisterUser } from "../../../domain/use-cases/user";
import { UserRepository } from "../../../domain/repositories";


@Controller('user')
export class UserController {
    
    constructor(
        private readonly userRepository: UserRepository
    ) { }
    
    handleError(error: Error, res: Response) {
        res.status(400).json({ error: error.message });
    }

    @Post('register')
    async register(
        @Res() res: Response,
        @Body() body: any
    ): Promise<any> {
        if (!body) return res.status(400).json({ error: 'Body is missing' });

        const [error, user] = RegisterUserDto.create(body);
        if (error) return res.status(400).json({ error });
        
        new RegisterUser(this.userRepository).execute(user!)
            .then(user => res.status(201).json(user))
            .catch(error => this.handleError(error, res));
    }
}