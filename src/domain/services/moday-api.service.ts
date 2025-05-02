import { MondayTaskEntity } from "../entities/monday-task.entity";

export const MONDAY_API = Symbol('MONDAY_API');


export abstract class MondayApi {
    abstract getDashboard(): Promise<MondayTaskEntity[]>;
    abstract create(token: string): MondayApi;
}