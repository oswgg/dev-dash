import { MondayTaskEntity } from "../../domain/entities";





export class MondayTaskMapper {
    static fromObjectToEntity(obj: any): any {
        return new MondayTaskEntity(
        );
    }
    
}