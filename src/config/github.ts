import { envs } from "./envs";



const GITHUB_CLIENT_ID = envs.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = envs.GITHUB_CLIENT_SECRET;


export class GithubAdapter {
    static async getTokenByCode(code: string)  {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: new URLSearchParams({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code as string
            })
        })
        
        return await response.json();
    }
    
    static async getTokenByRefreshToken(refreshToken: string) {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: new URLSearchParams({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        })
        
        return await response.json();
    }
    
    static async getUserData(accessToken: string) {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/json'
            }
        })
        
        return await response.json();
    }
}