import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class EntityNotFoundError extends DomainError {
  statusCode = HttpStatus.NOT_FOUND;
  errorCode = 'ENTITY_NOT_FOUND';

  constructor(entityName: string, id?: string) {
    const message = id
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;
    super(message);
  }
}
