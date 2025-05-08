import { google, Auth } from "googleapis";
import { envs } from "./envs";
import { Logger } from "@nestjs/common";

const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
];

export abstract class IGcpAdpater {
    abstract getAuthURL(): string;
    abstract setCredentialsByCode(code: string): Promise<boolean>;
    abstract getUserData(): Promise<any>;
}


export class GcpAdapter implements IGcpAdpater {
    public client: Auth.OAuth2Client;
    private readonly logger: Logger = new Logger("GCP Adapter");

    constructor() {
        this.client = new google.auth.OAuth2(
            envs.GCP_CLIENT_ID,
            envs.GCP_CLIENT_SECRET,
            envs.GCP_REDIRECT_URI
        );
    }

    getAuthURL(): string {
        const authURL = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });

        return authURL;
    }

    async setCredentialsByCode(code: string): Promise<boolean> {
        try {
            const { tokens } = await this.client.getToken(code);
            this.client.setCredentials(tokens);

            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async getUserData(): Promise<any> {
        try {
            const ouath2 = google.oauth2({
                version: 'v2',
                auth: this.client
            });
            
            const userinfo = await ouath2.userinfo.get();
            return userinfo.data;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}