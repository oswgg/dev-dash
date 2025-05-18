import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { envs } from "../../../config/envs";
import { NodeMailerMailerService } from "../../../infrastructure/services/nodemailer.mailer.service";
import { EmailService } from "../../../domain/services/email.service";





@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: envs.GMAIL_USER,
                    pass: envs.GMAIL_PASSWORD               
                },
            },
            defaults: {
                from: '"No Reply"',
            },
            template: {
                dir: `${__dirname}../../../../utils/templates/mails`,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ],
    providers: [
        NodeMailerMailerService,
        {
            provide: EmailService,
            useExisting: NodeMailerMailerService
        }
    ],
    exports: [EmailService]
})
export class MailModule { }