import { HttpStatus } from '@nestjs/common';
import {
  EntityNotFoundError,
  UniqueConstraintError,
  EntityCreationError,
  ValidationError,
} from '../';

describe('Domain Errors', () => {
  describe('EntityNotFoundError', () => {
    it('should create error with entity name and id', () => {
      const error = new EntityNotFoundError('Vehicle', '123');
      expect(error.message).toBe('Vehicle with ID 123 not found');
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.errorCode).toBe('ENTITY_NOT_FOUND');
    });

    it('should create error with only entity name', () => {
      const error = new EntityNotFoundError('Vehicle');
      expect(error.message).toBe('Vehicle not found');
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.errorCode).toBe('ENTITY_NOT_FOUND');
    });
  });

  describe('UniqueConstraintError', () => {
    it('should create error with entity name, field and value', () => {
      const error = new UniqueConstraintError('Vehicle', 'plate', 'ABC1234');
      expect(error.message).toBe("Vehicle with plate 'ABC1234' already exists");
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });

    it('should create error with entity name and field only', () => {
      const error = new UniqueConstraintError('Vehicle', 'plate');
      expect(error.message).toBe('Vehicle with this plate already exists');
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });
  });

  describe('EntityCreationError', () => {
    it('should create error with entity name', () => {
      const error = new EntityCreationError('Vehicle');
      expect(error.message).toBe('Vehicle not created');
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.errorCode).toBe('ENTITY_CREATION_FAILED');
    });
  });

  describe('ValidationError', () => {
    it('should create error with message', () => {
      const error = new ValidationError('Invalid data');
      expect(error.message).toBe('Invalid data');
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.errorCode).toBe('VALIDATION_ERROR');
    });
  });
});
