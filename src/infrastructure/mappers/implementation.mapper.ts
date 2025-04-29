import { ImplementationEntity } from "../../domain/entities";




export class ImplementationMapper {
    static fromObjectToEntity(object: { [key: string]: any }): ImplementationEntity {
        const { id, _id, userId, service, accessToken, refreshToken, username, enabled } = object;
        
        if (!id && !_id) throw new Error('Implementation id is missing');
        if (!userId) throw new Error('Implementation userId is missing');
        if (!service) throw new Error('Implementation service is missing');
        if (!accessToken) throw new Error('Implementation accessToken is missing');
        if (!username) throw new Error('Implementation username is missing');
        if (!enabled) throw new Error('Implementation enabled is missing');
        
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