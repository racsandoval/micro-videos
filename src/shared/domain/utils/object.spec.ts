import { deepFreeze } from "./objects";

describe('Object Unit Tests', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze('a');
    expect(typeof str).toBe('string');

    const boolean = deepFreeze(true);
    expect(typeof boolean).toBe('boolean');

    const int = deepFreeze(10);
    expect(typeof int).toBe('number');
  });

  it('should be an immutable object', () => {
    const obj = deepFreeze({ prop1: 'value1', deep: { prop2: 'value2', prop3: new Date() } });
    expect(() => (obj as any).prop1 = 'otherValue').toThrow(`Cannot assign to read only property 'prop1' of object '#<Object>'`);
    expect(() => (obj as any).deep.prop2 = 'otherValue').toThrow(`Cannot assign to read only property 'prop2' of object '#<Object>'`);
    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });
})
