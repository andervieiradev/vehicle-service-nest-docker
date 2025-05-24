import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class ValidationError extends DomainError {
  statusCode = HttpStatus.BAD_REQUEST;
  errorCode = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}
