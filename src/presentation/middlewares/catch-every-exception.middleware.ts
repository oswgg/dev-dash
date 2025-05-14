import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";




@Catch()
export class CatchEveryExceptionMiddleware implements ExceptionFilter {
    constructor (
        private logger: Logger = new Logger('CatchAllException')
    ) {

    }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        this.logger.error(exception);
        if (exception?.response?.statusCode === 404) {
            return response.status(HttpStatus.NOT_FOUND).json(exception.response);
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
            description: 'Something went wrong'
        });
    } 
}