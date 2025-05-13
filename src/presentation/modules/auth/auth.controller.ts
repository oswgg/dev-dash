import { Controller, Post, Body, Res, Inject, Get, Req } from "@nestjs/common";
import { Response } from "express";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos/user"
import { REGISTER_USER, RegisterUser } from "../../../domain/use-cases/user";
import { UserRepository } from "../../../domain/repositories";
import { LoginUser } from "../../../domain/use-cases/user/login-user.use-case";
import { USER_REPOSITORY } from "../../../infrastructure/di/tokens";
import { IGcpAdpater } from "../../../config/googleapi";
import { CryptoAdapter } from "../../../config/crypt";
import { RequestWithSession } from "../../../types/express";
import { BadRequestException, UnauthorizedException } from "../../../domain/errors/errors.custom";


@Controller('auth')
export class AuthController {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        @Inject(REGISTER_USER) private readonly registerUser: RegisterUser,
        private readonly gcpAdapter: IGcpAdpater
    ) { }

    @Post('register')
    async register(
        @Body() body: any
    ): Promise<any> {
        if (!body) throw new BadRequestException('Invalid Body', 'Body is missing');

        const [errors, user] = RegisterUserDto.create(body);
        if (errors) throw new BadRequestException('Invalid Body', 'Some fields are invalid', errors);

        return await this.registerUser.execute(user!);
    }


    @Post('login')
    async login(
        @Res() res: Response,
        @Body() body: any
    ): Promise<any> {
        if (!body) throw new BadRequestException('Invalid Body', 'Body is missing');

        const [errors, user] = LoginUserDto.create(body);
        if (errors) throw new BadRequestException('Invalid Body', 'Some fields are invalid', errors);
        
        return await new LoginUser(this.userRepository).execute(user!)
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
    ): Promise<any> {
        const { code, state } = req.body;
        const helperurl = new URL(`http://a.com?${state}`); 
        const query = helperurl.searchParams;

        const stateSession = query.get('sessionId');
        
        if (!req.session.oauthState)
            throw new UnauthorizedException('Missing Session', 'No session id was found');
        
        const { sessionId, timestamp, used } = req.session.oauthState;
        
        if (stateSession !== sessionId) 
            throw new UnauthorizedException('Invalid Session', 'Invalid session');

        if (Date.now() - timestamp > 60000)
            throw new UnauthorizedException('Invalid Session', 'Session expired');

        if (used)
            throw new UnauthorizedException('Invalid Session', 'Session already used');

        req.session.oauthState.used = true;
        await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            })
        });
        
        if (!code)  
            throw new BadRequestException('Bad Request', 'Code is missing');

        await this.gcpAdapter.setCredentialsByCode(code)
        
        const userDataFromGCP = await this.gcpAdapter.getUserData();
        
        const [errors, registerUserDto] = RegisterUserDto.create({
            name: userDataFromGCP.given_name,
            email: userDataFromGCP.email,
            password:  null,
            fromOAuth: true
        });
        
        if (errors) throw new BadRequestException('Invalid Body', 'Some fields are invalid', errors);
        
        return await this.registerUser.execute(registerUserDto!);
    }
}