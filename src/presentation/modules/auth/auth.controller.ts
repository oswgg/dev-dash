import { Controller, Post, Body, Res, Inject, Get, Req } from "@nestjs/common";
import { Response, Request } from "express";
import * as session from "express-session";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos/user"
import { REGISTER_USER, RegisterUser } from "../../../domain/use-cases/user";
import { UserRepository } from "../../../domain/repositories";
import { LoginUser } from "../../../domain/use-cases/user/login-user.use-case";
import { USER_REPOSITORY } from "../../../infrastructure/di/tokens";
import { IGcpAdpater } from "../../../config/googleapi";
import { CryptoAdapter } from "../../../config/crypt";
import { RequestWithSession } from "../../../types/express";
import * as querystring from "querystring"
import * as url from "url";


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

    @Get('oauth/google')
    async googleOAuth(
        @Req() req: RequestWithSession,
        @Res() res: Response
    ): Promise<any> {
        const sessionId = CryptoAdapter.createRandomString(16, 'hex');

        req.session.oauthState = {
            sessionId,
            timestamp: Date.now(),
            used: false
        };

        // Wait for the session to be saved
        await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            })
        });
        
        const state = new URLSearchParams({ 
            sessionId: sessionId,
        }); 
        const url = this.gcpAdapter.getAuthURL(state.toString());

        res.status(200).json({ url });
    }

    @Post('oauth/google/callback')
    async googleOAuthCallback(
        @Req() req: RequestWithSession,
        @Res() res: Response
    ): Promise<any> {
        const { code, state } = req.body;
        const helperurl = new URL(`http://a.com?${state}`); 
        const query = helperurl.searchParams;

        const stateSession = query.get('sessionId');
        
        if (!req.session.oauthState)
            return res.status(400).json({ error: 'No session id was found' });
        
        const { sessionId, timestamp, used } = req.session.oauthState;
        
        if (stateSession !== sessionId) 
            return res.status(400).json({ error: 'Invalid session id' });

        if (Date.now() - timestamp > 60000)
            return res.status(400).json({ error: 'Session expired' });

        if (used)
            return res.status(400).json({ error: 'Session already used' });

        req.session.oauthState.used = true;
        await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            })
        });
        
        if (!code) return res.status(400).json({ error: 'Code is missing' });
        
        try {
            await this.gcpAdapter.setCredentialsByCode(code)
            
            const userDataFromGCP = await this.gcpAdapter.getUserData();
            
            const [error, registerUserDto] = RegisterUserDto.create({
                name: userDataFromGCP.given_name,
                email: userDataFromGCP.email,
                password:  null,
                fromOAuth: true
            });
            
            if (error) return res.status(400).json({ error });
            
            const user = await this.registerUser.execute(registerUserDto!)
                .then(user => res.status(201).json(user))
                .catch(error => this.handleError(error, res));

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}