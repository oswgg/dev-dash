import { Controller, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos/user"
import { RegisterUser } from "../../../domain/use-cases/user";
import { UserRepository } from "../../../domain/repositories";
import { LoginUser } from "../../../domain/use-cases/user/login-user.use-case";


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
    

    @Post('login')
    async login(
        @Res() res: Response,
        @Body() body: any
    ): Promise<any> {
        if (!body) return res.status(400).json({ error: 'Body is missing' });
        
        const [error, user] = LoginUserDto.create(body);
        if (error) return res.status(400).json({ error });
        
        new LoginUser(this.userRepository).execute(user!)
            .then(user => res.status(200).json(user))
            .catch(error => this.handleError(error, res));
    }
}