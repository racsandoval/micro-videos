import { FieldsErrors } from './shared/domain/validators/validator-fields-interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (received: FieldsErrors) => R
    }
  }
}

export {};