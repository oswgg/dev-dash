import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { CustomException } from "../../domain/errors/errors.custom";





@Catch(CustomException)
export class HttpExceptionMiddleware implements ExceptionFilter {
    catch(exception: CustomException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.statusCode;

        return response.status(status).json({
            status: status,
            message: exception.message,
            description: exception.description || null,
            errors: exception.errors
        });
    }
}
