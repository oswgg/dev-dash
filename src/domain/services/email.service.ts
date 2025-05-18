




export abstract class EmailService {
    abstract sendResetPasswordEmail(email: string): Promise<void>;
}