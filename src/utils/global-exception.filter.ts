import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { TelexService } from '../telex/telex.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly telexService: TelexService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    let status = 500;
    let message = 'Internal server error';
    let errorDetails = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorDetails = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = {
        url: request.url,
        method: request.method,
        message: exception.message,
        stack: exception.stack,
      };

      this.telexService.sendErrorToTelex(message, errorDetails);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: 'Internal Server Error',
    });
  }
}
