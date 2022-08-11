import UniqueEntityId from '../../../shared/domain/value-objects/unique-entity-id.vo';
import { omit } from 'lodash';
import { Category } from './category';

describe('Category Unit Tests', () => {
  test('constructor of category', () => {
    let category = new Category({ name: 'Movie' });
    let props = omit(category.props, 'created_at');
    expect(props).toStrictEqual({
      name: 'Movie',
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({ name: 'Movie', description: 'some description', is_active: false, created_at });
    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at,
    })
  });

  test('id field', () => {
    const testInputs = [
      { props: { name: 'Video' } },
      { props: { name: 'Video' }, id: null },
      { props: { name: 'Video' }, id: undefined },
      { props: { name: 'Video' }, id: new UniqueEntityId() },
    ]

    testInputs.forEach((input) => {
      const category = new Category(input.props, input.id);
      expect(category.id).not.toBeNull;
      expect(category.id).toBeInstanceOf(UniqueEntityId);
    });
  });

  test('getter of name prop', () => {
    const category = new Category({ name: 'Movie' });
    expect(category.name).toBe('Movie');
  });

  test('getter and setter of description prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.description).toBeNull;

    category = new Category({ name: 'Movie', description: 'some description' });
    expect(category.description).toBe('some description');

    category = new Category({ name: 'Movie' });
    category['description'] = 'other description';
    expect(category.description).toBe('other description');

    category['description'] = undefined;
    expect(category.description).toBeNull;
  });

  test('getter and setter of is_active prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.is_active).toBeTruthy;

    category = new Category({ name: 'Movie', is_active: true });
    expect(category.is_active).toBeTruthy;

    category = new Category({ name: 'Movie', is_active: false });
    expect(category.is_active).toBeFalsy;

    category = new Category({ name: 'Movie' });
    category['is_active'] = false;
    expect(category.is_active).toBeFalsy;
  });

  test('getter of created_at prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    category = new Category({ name: 'Movie', created_at });
    expect(category.created_at).toBe(created_at);
  });
});