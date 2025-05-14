import { UserEntity } from "../../domain/entities/user.entity";
import { InternalServerException } from "../../domain/errors/errors.custom";



export class UserMapper {

    static fromObjectToEntity(object: { [key: string]: any }): UserEntity {
        let { id, _id, name, email, password, fromOAuth } = object;
        
        if (!id && !_id)             throw new InternalServerException('User id is missing');
        if (!name)                   throw new InternalServerException('User name is missing');
        if (!email)                  throw new InternalServerException('User email is missing');
        if (!fromOAuth && !password) throw new InternalServerException('User password is missing');

        return new UserEntity(
            _id || id,
            name,
            email,
            password
        );
    }
    
    static noPassword(user: UserEntity): Omit<UserEntity, 'password'> {
        const { password, ...safeUser } = user ;
        return safeUser;
    }
}