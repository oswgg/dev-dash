import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";




export class AxiosAdapter {
    private client: AxiosInstance;

    constructor(
        url: string,
        token?: string
    ) {
        this.client = axios.create({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        })

        this.client.interceptors.response.use((response): AxiosResponse<any, any> | Promise<AxiosResponse<any, any>> => {
            return Promise.resolve(response.data);

        }, (error: any) => {
            return Promise.reject({ status: error.status, message: error.response.statusText });
        });
    }

    get(params?: any) {
        return this.client.get('/', params);
    }

    post(data?: any) {
        return this.client.post('/', data);
    }


}