import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from './category.validator';

describe('CategoryValidator Tests', () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create()
  });

  test('invalidation cases for name field', () => {
    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
        ]
    });

    expect({ validator, data: { name: '' } }).containsErrorMessages({
      name: ['name should not be empty']
    });

    expect({ validator, data: { name: 3 as any } }).containsErrorMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]
    });

    expect({ validator, data: { name: 'a'.repeat(256) } }).containsErrorMessages({
      name: ['name must be shorter than or equal to 255 characters']
    });
  });

  test('invalidation cases for description field', () => {
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ['description must be a string']
    });
  });

  test('invalidation cases for is_active field', () => {
    expect({ validator, data: { is_active: 5 } }).containsErrorMessages({
      is_active: ['is_active must be a boolean value']
    });

    expect({ validator, data: { is_active: 0 } }).containsErrorMessages({
      is_active: ['is_active must be a boolean value']
    });
  });

  test('valid cases for fields', () => {
    const dataArrange = [
      { name: 'name' },
      { name: 'name', description: undefined },
      { name: 'name', description: 'description' },
      { name: 'name', is_active: undefined },
      { name: 'name', is_active: true },
      { name: 'name', is_active: false }
    ]
    
    dataArrange.forEach((data) => {
      expect(validator.validate(data)).toBeTruthy;
      expect(validator.validateData).toStrictEqual(new CategoryRules(data));
    })
  });
}); 