import { UserEntity } from "../../domain/entities/user.entity";



export class UserMapper {

    static fromObjectToEntity(object: { [key: string]: any }): UserEntity {
        const { id, _id, name, email, password } = object;
        
        if (!id && !_id) throw new Error('User id is missing');
        if (!name) throw new Error('User name is missing');
        if (!email) throw new Error('User email is missing');
        if (!password) throw new Error('User password is missing');

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