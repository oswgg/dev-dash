import { MailerService } from "@nestjs-modules/mailer";
import { EmailService } from "../../domain/services/email.service";
import { Injectable } from "@nestjs/common";
import { envs } from "../../config/envs";





@Injectable()
export class NodeMailerMailerService implements EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendResetPasswordEmail(email: string): Promise<void> { 
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Password',
            template: './forgot-password',
            context: {
                name: 'Oscar',
                url: `${envs.FRONT_URL}/forgot-password`,
                year: new Date().getFullYear()
            }
        })
    }
}