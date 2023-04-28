import NotFoundError from '../../../../shared/domain/errors/not-found.error';
import { Category } from '../../../domain/entity/category';
import CategoryInMemoryRepository from '../../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase Unit Test', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity is not found', () => {
    expect(() => useCase.execute({ id: 'fake id', name: 'fake' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Category({ name: 'Movie' });
    repository.items = [entity];

    const arrange = [
      {
        input: { id: entity.id, name: 'Updated Movie' },
        expected: {
          id: entity.id,
          name: 'Updated Movie',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: { id: entity.id, name: 'Updated2 Movie', description: 'description' },
        expected: {
          id: entity.id,
          name: 'Updated2 Movie',
          description: 'description',
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: { id: entity.id, name: 'Updated3 Movie', is_active: false },
        expected: {
          id: entity.id,
          name: 'Updated3 Movie',
          description: 'description',
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: { id: entity.id, name: 'Updated4 Movie' },
        expected: {
          id: entity.id,
          name: 'Updated4 Movie',
          description: 'description',
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: { id: entity.id, name: 'Updated5 Movie', is_active: true },
        expected: {
          id: entity.id,
          name: 'Updated5 Movie',
          description: 'description',
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: { id: entity.id, name: 'Updated6 Movie', description: 'another description', is_active: false },
        expected: {
          id: entity.id,
          name: 'Updated6 Movie',
          description: 'another description',
          is_active: false,
          created_at: entity.created_at,
        }
      }
    ]

    for (let i = 0; i < arrange.length; i++) {
      const { input, expected } = arrange[1];
      const output = await useCase.execute(input);

      expect(spyUpdate).toHaveBeenCalledTimes(i + 1);
      expect(output).toStrictEqual(expected);
    }
  });
})