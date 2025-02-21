import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import { TelexService } from '../telex/telex.service';
import { ITelexErrorDetails } from 'src/telex/telex.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly telexService: TelexService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    let status = 500;
    let message = 'Internal server error';
    let details: ITelexErrorDetails = {
      url: request.url,
      method: request.method,
      message: message,
      stack: '',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      const exceptionResponse = exception.getResponse();

      details = {
        url: request.url,
        method: request.method,
        message:
          typeof exceptionResponse === 'string' ? exceptionResponse : message,
        stack: '',
      };
    } else if (exception instanceof Error) {
      message = exception.message;

      details = {
        url: request.url,
        method: request.method,
        message: exception.message,
        stack: exception.stack || '',
      };

      this.telexService.sendErrorToTelex(details);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: 'Internal Server Error',
    });
  }
}
