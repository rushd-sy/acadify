import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  DuplicateExamSectionError,
  ExamDomainError,
} from '../domain/exam.errors';
import type { Response } from 'express';

@Catch(ExamDomainError)
export class ExamDomainExceptionFilter implements ExceptionFilter<ExamDomainError> {
  catch(exception: ExamDomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof DuplicateExamSectionError) {
      response.status(409).json({
        statusCode: 409,
        message: exception.message,
        error: 'Conflict',
      });
      return;
    }
    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
