import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError)
export class ValidationExceptionFilter implements ExceptionFilter {
catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    if (exception instanceof MongooseError.ValidationError) {
      response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors: exception.errors,
      });
    } else {
      // Handle other Mongoose errors if needed
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
      });
    }
  }
}
