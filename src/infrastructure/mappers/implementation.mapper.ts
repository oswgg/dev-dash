import { ImplementationEntity } from "../../domain/entities";
import { InternalServerException } from "../../domain/errors/errors.custom";




export class ImplementationMapper {
    static fromObjectToEntity(object: { [key: string]: any }): ImplementationEntity {
        const { id, _id, userId, service, accessToken, refreshToken, username, enabled } = object;
        
        if (!id && !_id)  throw new InternalServerException('Implementation id is missing');
        if (!userId)      throw new InternalServerException('Implementation userId is missing');
        if (!service)     throw new InternalServerException('Implementation service is missing');
        if (!accessToken) throw new InternalServerException('Implementation accessToken is missing');
        if (!username)    throw new InternalServerException('Implementation username is missing');
        if (!enabled)     throw new InternalServerException('Implementation enabled is missing');
        
        return new ImplementationEntity(
            _id || id,
            userId,
            service,
            accessToken,
            refreshToken,
            username,
            enabled
        );
    }
}