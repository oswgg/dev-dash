import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { CustomException, InternalServerException } from "../../domain/errors/errors.custom";





@Catch(CustomException)
export class HttpExceptionMiddleware implements ExceptionFilter {
    constructor (
        private logger: Logger = new Logger('HttpExceptionMiddleware')
    ) { }

    catch(exception: CustomException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.statusCode;
        
        if (exception instanceof InternalServerException) { 
            this.logger.error(exception);
            return response.status(status).json({
                status: status,
                message: exception.message,
            });
        }

        return response.status(status).json({
            status: status,
            message: exception.message,
            description: exception.description || null,
            errors: exception.errors
        });
    }
}
