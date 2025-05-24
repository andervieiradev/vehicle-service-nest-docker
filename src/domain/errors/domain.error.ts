import { HttpStatus } from '@nestjs/common';

export abstract class DomainError extends Error {
  abstract statusCode: HttpStatus;
  abstract errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
