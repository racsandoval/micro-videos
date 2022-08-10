import { validate as uuidValidate } from 'uuid';
import InvaludUuidError from "../../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";

describe('UniqueEntityId Unit Tests', () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('not-an-uuid')).toThrow(new InvaludUuidError());
    expect(validateSpy).toHaveBeenCalled;
  });

  it('should accept an uuidpassed in constructor', () => {
    const uuid = 'cf317fac-e99b-4917-97fd-fcb11320a9ad';
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled;
  });

  it('should generate valid uuid', () => {
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy;
    expect(validateSpy).toHaveBeenCalled;
  });
})