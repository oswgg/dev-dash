import { envs } from "./envs";


const MONDAY_CLIENT_ID = envs.MONDAY_CLIENT_ID;
const MONDAY_CLIENT_SECRET = envs.MONDAY_CLIENT_SECRET;


export class MondayAdapter {
    static base = 'https://api.monday.com/v2/';

    static async getTokenByCode(code: string)  {
        const response = await fetch('https://auth.monday.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: new URLSearchParams({
                client_id: MONDAY_CLIENT_ID,
                client_secret: MONDAY_CLIENT_SECRET,
                code: code 
            })
        });
        
        return await response.json();
    }
    
    static async getUserData(accessToken: string) {
        const response = await fetch(this.base, {
            method: 'POST',
            body: JSON.stringify({
                query: `
                    query {
                        me {
                            id
                            name
                        }
                    }
                `
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
       return await response.json(); 
    }
}