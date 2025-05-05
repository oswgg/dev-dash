


export class CustomError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
    
    static internal() {
        return new CustomError(500, 'Internal server error');
    }
    
    static unauthorized(message: string) {
        return new CustomError(401, message);
    }

    static forbidden(message: string) {
        return new CustomError(403, message);
    }

    static notFound(message: string) {
        return new CustomError(404, message);
    }

    static badRequest(message: string) {
        return new CustomError(400, message);
    }
}