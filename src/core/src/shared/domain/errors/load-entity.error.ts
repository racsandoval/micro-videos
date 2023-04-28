import { FieldsErrors } from "#core/domain";

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? 'Entity cannot be loaded');
    this.name = 'LoadEntityError';
  }
}