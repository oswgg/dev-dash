import { get } from "env-var";



export const envs = {
    MONGO_URL:  get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    GITHUB_CLIENT_ID: get('GITHUB_CLIENT_ID').required().asString(),
    GITHUB_CLIENT_SECRET: get('GITHUB_CLIENT_SECRET').required().asString(),
    GITHUB_WEBHOOK_SECRET: get('GITHUB_WEBHOOK_SECRET').required().asString(),
    GITHUB_REDIRECT_URI: get('GITHUB_REDIRECT_URI').required().asString(),
}