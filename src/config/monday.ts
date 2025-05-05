import { Logger } from "@nestjs/common";
import { envs } from "./envs";
import { AxiosAdapter } from "./axios";
import { MondayApi } from "../domain/services/moday-api.service";
import { MondayUserEntity, MondayTaskEntity } from "../domain/entities/";
import { MondayUserMapper, MondayTaskMapper } from "../infrastructure/mappers/";
import { CustomError } from "../domain/errors/errors.custom";

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
    private readonly logger: Logger;
    constructor(token: string) {
        super();
        this.client = new AxiosAdapter(MondayAdapter.base, token);
        this.logger = new Logger('MONDAY_ADAPTER');
    }

    create(token: string) {
        return new MondayAdapter(token);
    }
    
    async getUserData(): Promise<MondayUserEntity> {
        try {
            const user = await this.client.post({
                query: `
                   query {
                       me {
                           id
                           name
                           photo_thumb
                       }
                   }
                `
            });
            

            return MondayUserMapper.fromApiCallToEntity(user.data);
            
        } catch (error: any) {
            this.logger.error(error);
            throw CustomError.internal();
        }
    }

    async getUserTasks(): Promise<MondayTaskEntity[]> {
        try {

            const tasks = await this.client.post(JSON.stringify({
                query: `
                    query {
                        boards {
                            id
                            name
                            items_page (query_params: {rules: [{column_id: "person", compare_value: ["assigned_to_me"], operator: any_of}]}) {
                                items {
                                    id
                                    name
                                    column_values(ids: ["status"]) {
                                        text
                                    }
                                }
                            }
                        }
                    }
                    `
                })
            );
            
            return MondayTaskMapper.fromApiCallToEntity(tasks.data);

        } catch (error: any) {
            this.logger.error(error);
            throw CustomError.internal();
        }

    }
}