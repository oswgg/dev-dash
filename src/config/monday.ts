import { MondayTaskEntity } from "../domain/entities";
import { MondayApi } from "../domain/services/moday-api.service";
import { MondayTaskMapper } from "../infrastructure/mappers/monday-task.mapper";
import { AxiosAdapter } from "./axios";
import { envs } from "./envs";


const MONDAY_CLIENT_ID = envs.MONDAY_CLIENT_ID;
const MONDAY_CLIENT_SECRET = envs.MONDAY_CLIENT_SECRET;


export class MondayAdapter extends MondayApi {
    static base = 'https://api.monday.com/v2/';

    static async getTokenByCode(code: string) {
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

    private readonly client: AxiosAdapter;
    constructor(token: string) {
        super();
        this.client = new AxiosAdapter(token);
    }

    create(token: string) {
        return new MondayAdapter(token);
    }

    async getDashboard(): Promise<MondayTaskEntity[]> {
        try {

            const a = await this.client.post(JSON.stringify({
                query: `
                    query {
                        boards {
                            id
                            name
                        }
                    }
                `
                })
            );

            
            return a.data.map(MondayTaskMapper.fromObjectToEntity);

        } catch (error: any) {

            return [];
        }

    }
}