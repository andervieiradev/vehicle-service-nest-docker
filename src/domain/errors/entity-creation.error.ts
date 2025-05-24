import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class EntityCreationError extends DomainError {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  errorCode = 'ENTITY_CREATION_FAILED';

  constructor(entityName: string) {
    super(`${entityName} not created`);
  }
}
