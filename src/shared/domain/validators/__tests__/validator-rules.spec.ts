import { ValidationError } from "../../errors/validation-error";
import ValidatorRules from "../validator-rules";

type ExpectedValidationRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error?: ValidationError;
  params?: any[];
}

function assertIsInvalid({ value, property, rule, error, params = [] }: ExpectedValidationRule) {
  const validator = ValidatorRules.values(value, property)
  const method = validator[rule];
  expect(() => method.apply(validator, params)).toThrow(error);
}

function assertIsValid({ value, property, rule, params = [] }: ExpectedValidationRule) {
  const validator = ValidatorRules.values(value, property)
  const method = validator[rule];
  expect(() => method.apply(validator, params)).not.toThrow;
}

describe('ValidatorRules Unit Test', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('some value', 'field');
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator['value']).toBe('some value');
    expect(validator['property']).toBe('field');
  });

  test('required validation rule', () => {
    const invalidArrange = [null, undefined, ''];
    invalidArrange.forEach((value) => {
      assertIsInvalid({ value, property: 'field', rule: 'required', error: new ValidationError(`The field is required`) });
    });

    const validArrange = ['test', 5, 0, true, {}, { propr1: 'value1' }, [], ['value'], new Date()];
    validArrange.forEach((value) => {
      assertIsValid({ value, property: 'field', rule: 'required' });
    });
  });

  test('string validation rule', () => {
    const invalidArrange = [5, 0, true, {}, { propr1: 'value1' }, [], ['value'], new Date()];
    invalidArrange.forEach((value) => {
      assertIsInvalid({ value, property: 'field', rule: 'string', error: new ValidationError(`The field must be a string`) });
    });

    const validArrange = ['test', '', null, undefined];
    validArrange.forEach((value) => {
      assertIsValid({ value, property: 'field', rule: 'string' });
    });
  });

  test('maxLength validation rule', () => {
    const maxLength = 5;
    const invalidArrange = ['testetestes', [1, 2, 3, 4, 5, 6], 0, 5, true, new Date()];
    invalidArrange.forEach((value) => {
      assertIsInvalid({ value, property: 'field', rule: 'maxLength', params: [maxLength], error: new ValidationError(`The field must be less or equal than ${maxLength} characters`) });
    });

    const validArrange = ['', 'test', 'teste', [], [1, 2, 3, 4], [1, 2, 3, 4, 5], null, undefined];
    validArrange.forEach((value) => {
      assertIsValid({ value, property: 'field', rule: 'maxLength', params: [maxLength] });
    });
  });

  test('boolean validation rule', () => {
    const invalidArrange = ['', 'teste', [], 0, 5, new Date(), {}];
    invalidArrange.forEach((value) => {
      assertIsInvalid({ value, property: 'field', rule: 'boolean', error: new ValidationError(`The field must be a boolean`) });
    });

    const validArrange = [true, false, undefined, null];
    validArrange.forEach((value) => {
      assertIsValid({ value, property: 'field', rule: 'boolean' });
    });
  });

  it('should throw validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => validator.required().string()).toThrow(new ValidationError(`The field is required`));

    validator = ValidatorRules.values(5, 'field');
    expect(() => validator.required().string()).toThrow(new ValidationError(`The field must be a string`));

    validator = ValidatorRules.values('teste', 'field');
    expect(() => validator.string().maxLength(4)).toThrow(new ValidationError(`The field must be less or equal than 4 characters`));

    validator = ValidatorRules.values('teste', 'field');
    expect(() => validator.required().boolean()).toThrow(new ValidationError(`The field must be a boolean`));
  });

  it('should validate when combine two or more validation rules', () => {
    expect.assertions(0);
    ValidatorRules.values(null, 'field').string().maxLength(5).boolean();
    ValidatorRules.values(undefined, 'field').string().maxLength(5).boolean();
    ValidatorRules.values('teste', 'field').required().string().maxLength(5);
    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  });
});
