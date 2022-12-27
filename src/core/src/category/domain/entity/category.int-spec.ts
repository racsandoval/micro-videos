import { Category } from './category';

describe('Category Integration Tests', () => {
  describe('create method', () => {
    it('should throw error when a category is created with invalid name field', () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
          ]
      });

      expect(() => new Category({ name: undefined })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
          ]
      });

      expect(() => new Category({ name: '' })).containsErrorMessages({
        name: ['name should not be empty']
      });
  

      expect(() => new Category({ name: 'a'.repeat(256) })).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      });
  
      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: ['name must be a string', 'name must be shorter than or equal to 255 characters']
      });
    });
  
    it('should throw error when a category is created with invalid description field', () => {
      expect(() => new Category({ name: 'name', description: 5 as any })).containsErrorMessages({
        description: ['description must be a string']
      });
    });
  
    it('should throw error when a category is created with invalid is_active field', () => {
      expect(() => new Category({ name: 'name', is_active: 'active' as any })).containsErrorMessages({
        is_active: ['is_active must be a boolean value']
      });
    });

    it('should create a valid category', () => {
      expect.assertions(0);
      new Category({ name: 'Name' }); // NOSONAR
      new Category({ name: 'Name', description: 'description' }); // NOSONAR
      new Category({ name: 'Name', description: null }); // NOSONAR
      new Category({ name: 'Name', is_active: true }); // NOSONAR
      new Category({ name: 'Name', is_active: false }); // NOSONAR
      new Category({ name: 'Name', description: 'description', is_active: true }); // NOSONAR
    });
  });

  describe('update method', () => {
    it('should throw error when a category is updated with invalid name field', () => {
      const category = new Category({ name: 'Name' });
      expect(() => category.update({ name: 'a'.repeat(256) })).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      });

      expect(() => category.update({ name: 5 as any })).containsErrorMessages({
        name: ['name must be a string', 'name must be shorter than or equal to 255 characters']
      });
    });
  
    it('should throw error when a category is updated with invalid description field', () => {
      const category = new Category({ name: 'Name' });
      expect(() => category.update({ description: 5 as any })).containsErrorMessages({
        description: ['description must be a string']
      });
    });

    it('should update category successfully', () => {
      expect.assertions(0);
      const category = new Category({ name: 'Name' });
      category.update({ name: 'Other movie' });
      category.update({ description: 'description' });
      category.update({ name: null, description: 'other description' });
      category.update({ name: 'Other movie', description: null });
    });
  });
});