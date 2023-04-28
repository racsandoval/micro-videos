import { ListCategoriesUseCase } from '../list-categories.use-case';
import CategoryInMemoryRepository from '../../../infra/db/in-memory/category-in-memory.repository';
import CategoryRepository from '../../../domain/repository/category.repository';
import { Category } from '../../../domain/entity/category';

describe('ListCategoriesUseCase Unit Test', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });

    const entity = new Category({ name: 'Movie' });
    result = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity.toJson()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });

  it('should return output with empty input categories ordered by created_at', async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: 'test 1', created_at }),
      new Category({ name: 'test 2', created_at: new Date(created_at.getTime() + 100) }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map((item) => item.toJson()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      new Category({ name: 'a' }),
      new Category({ name: 'AAA' }),
      new Category({ name: 'c' }),
      new Category({ name: 'AaA' }),
      new Category({ name: 'b' }),
    ];
    repository.items = items;

    let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' });
    expect(output).toStrictEqual({
      items: [items[1], items[3]].map((item) => item.toJson()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' });
    expect(output).toStrictEqual({
      items: [items[0]].map((item) => item.toJson()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'a' });
    expect(output).toStrictEqual({
      items: [items[0], items[3]].map((item) => item.toJson()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
})