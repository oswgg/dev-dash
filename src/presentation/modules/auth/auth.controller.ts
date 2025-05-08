import { Controller, Post, Body, Res, Inject, Get, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos/user"
import { REGISTER_USER, RegisterUser } from "../../../domain/use-cases/user";
import { UserRepository } from "../../../domain/repositories";
import { LoginUser } from "../../../domain/use-cases/user/login-user.use-case";
import { USER_REPOSITORY } from "../../../infrastructure/di/tokens";
import { IGcpAdpater } from "../../../config/googleapi";


@Controller('auth')
export class AuthController {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        @Inject(REGISTER_USER) private readonly registerUser: RegisterUser,
        private readonly gcpAdapter: IGcpAdpater
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

        this.registerUser.execute(user!)
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

    @Get('signup/google')
    async googleOAuth(@Res() res: Response): Promise<any> {
        const url = this.gcpAdapter.getAuthURL();
        res.redirect(url);
    }

    @Get('signup/google/callback')
    async googleOAuthCallback(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<any> {
        const { code } = req.query;

        try {

            const ok = await this.gcpAdapter.setCredentialsByCode(code as string);
            if (!ok) return res.status(400).json({ error: 'Invalid code' });

            const userData = await this.gcpAdapter.getUserData();
            
            const [error, user] = RegisterUserDto.create({
                name: userData.given_name,
                email: userData.email,
                password: null,
                fromOAuth: true,
            });
            if (error) return res.status(400).json({ error });
            
            this.registerUser.execute(user!)
                .then(user => res.status(201).json(user))
                .catch(error => this.handleError(error, res));

        } catch (error: any) {
            this.handleError(error, res);
        }
    }
}