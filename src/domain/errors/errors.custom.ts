export interface IErrorDescription {
    message?: string;
    sent?: {
        [key: string]: any;
    }
}

export type errorMessage = 
'Invalid Body' |
'Missing Token' |
'Invalid Token' |
'Invalid Credentials' |
'Internal Server Error' | 
'Missing Session' |
'Invalid Session' |
'Not Found' |
'Duplicated' |
'Forbidden' |
'Unauthorized' |
'Bad Request';

export class CustomException extends Error {
    constructor(
        public message: errorMessage, 
        public statusCode: number,  
        public description: string | null = null, 
        public errors?: IErrorDescription[] | IErrorDescription
    ) { 
        super(message);
    }
}

export class UnauthorizedException extends CustomException {
    constructor(message: errorMessage, description?: string, errors?: IErrorDescription[] | IErrorDescription) {
        super(message, 401, description, errors);
    }
}

export class BadRequestException extends CustomException {
    constructor(message: errorMessage, description?: string, errors?: IErrorDescription[]) {
        super(message, 400, description, errors);
    }
}

export class ForbiddenException extends CustomException {
    constructor(message: errorMessage, description?: string, errors?: IErrorDescription[] | IErrorDescription) {
        super(message, 403, description, errors);
    }
}

export class NotFoundException extends CustomException {
    constructor(message: errorMessage, description?: string, errors?: IErrorDescription[] | IErrorDescription) {
        super(message, 404, description, errors);
    }
}

export class DuplicatedException extends CustomException {
    constructor(message: errorMessage, description?: string, sent: { [key: string]: any } = {}) {
        super(message, 409, description, { sent });
    }
}

export class InternalServerException extends CustomException {
    constructor(description: string) {
        super('Internal Server Error', 500, description);
    }
}
