import ClassValidatorFields from '../validators/class-validator-fields';
import { FieldsErrors } from '../validators/validator-fields-interface';
import expect from 'expect';
import { EntityValidationError } from '../errors/validation-error';

type Expected = { validator: ClassValidatorFields<any>, data: any } | (() => any);

expect.extend({
  containsErrorMessages (expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessages(error.error, received)
      }
    } else {
      const isDataValid = expected.validator.validate(expected.data);
  
      if (isDataValid) {
        return isValid();
      }
  
      return assertContainsErrorMessages(expected.validator.errors, received)
    }
  }
});

function isValid() {
  return {
    pass: false,
    message: () => 'The data is valid',
  }
}

function assertContainsErrorMessages(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
  
  return isMatch
    ? { pass: true, message: () => '' }
    : { pass: false, message: () => `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}` }
}