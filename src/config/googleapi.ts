import { google, Auth } from "googleapis";
import { envs } from "./envs";
import { Logger } from "@nestjs/common";

const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
];

type GCPUserData = {
        /**
         * The user's email address.
         */
        email?: string | null;
        /**
         * The user's last name.
         */
        family_name?: string | null;
        /**
         * The user's gender.
         */
        gender?: string | null;
        /**
         * The user's first name.
         */
        given_name?: string | null;
        /**
         * The hosted domain e.g. example.com if the user is Google apps user.
         */
        hd?: string | null;
        /**
         * The obfuscated ID of the user.
         */
        id?: string | null;
        /**
         * URL of the profile page.
         */
        link?: string | null;
        /**
         * The user's preferred locale.
         */
        locale?: string | null;
        /**
         * The user's full name.
         */
        name?: string | null;
        /**
         * URL of the user's picture image.
         */
        picture?: string | null;
        /**
         * Boolean flag which is true if the email address is verified. Always verified because we only return the user's primary email address.
         */
        verified_email?: boolean | null 
}

export abstract class IGcpAdpater {
    abstract getAuthURL(state: string): string;
    abstract setCredentialsByCode(code: string): Promise<boolean>;
    abstract getUserData(): Promise<GCPUserData>;
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

    getAuthURL(state: string): string {
        const authURL = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            state: state
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

    async getUserData(): Promise<GCPUserData> {
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