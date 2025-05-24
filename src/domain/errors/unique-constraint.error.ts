import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class UniqueConstraintError extends DomainError {
  statusCode = HttpStatus.CONFLICT;
  errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';

  constructor(entityName: string, field: string, value?: string) {
    const message = value
      ? `${entityName} with ${field} '${value}' already exists`
      : `${entityName} with this ${field} already exists`;
    super(message);
  }
}
