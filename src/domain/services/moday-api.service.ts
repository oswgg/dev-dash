import { MondayTaskEntity } from "../entities/monday-task.entity";
import { MondayUserEntity } from "../entities/monday-user.entity";

export const MONDAY_API = Symbol('MONDAY_API');


export abstract class MondayApi {
    abstract create(token: string): MondayApi;
    abstract getUserTasks(): Promise<MondayTaskEntity[]>;
    abstract getUserData(): Promise<MondayUserEntity>;
}