import { DeleteCategoryUseCase } from '../delete-category.use-case';
import CategoryInMemoryRepository from '../../../infra/repository/category-in-memory.repository';
import NotFoundError from '../../../../shared/domain/errors/not-found.error';
import { Category } from '../../../domain/entity/category';

describe('DeleteCategoryUseCase Unit Test', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity is not found', () => {
    expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should delete a category', async () => {
    const items = [new Category({ name: 'Movie' })];
    repository.items = items;
    await useCase.execute({ id: items[0].id });
    expect(repository.items).toHaveLength(0);
  });
})