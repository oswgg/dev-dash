import { MondayUserEntity } from "../../domain/entities/monday-user.entity";





export class MondayUserMapper {
    static fromApiCallToEntity(obj: any): MondayUserEntity {
        return this.fromObjectToEntity({
            id: obj.me.id,
            name: obj.me.name,
            photo: obj.me.photo_thumb
        });
    }
    
    static fromObjectToEntity(obj: any): MondayUserEntity {
        return new MondayUserEntity(
            obj.id,
            obj.name,
            obj.photo
        );
    }
}