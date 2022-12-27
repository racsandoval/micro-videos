import ClassValidatorFields from '../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{ field: string }> {}

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData as null', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull;
    expect(validator.validateData).toBeNull;
  });

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([{ property: 'field', constraints: { isRequired: 'some error' } }]);

    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy;
    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.validateData).toBeNull;
    expect(validator.errors).toStrictEqual({ field: ['some error'] });
  });

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([]);

    const validator = new StubClassValidatorFields();
    expect(validator.validate({ field: 'value' })).toBeTruthy;
    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.validateData).toStrictEqual({ field: 'value' });
    expect(validator.errors).toBeNull;
  });
})