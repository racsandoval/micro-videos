
import { Category } from '../../../domain/entity/category';
import CategoryInMemoryRepository from './category-in-memory.repository';

describe('CategoryInMemotyRepository Unit Test', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it('should not filter items', async () => {
    const items = [new Category({ name: 'test' })];
    const filterSpy = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled;
    expect(filteredItems).toStrictEqual(filteredItems);
  });

  it('should filter items using filter parameter', async () => {
    const items = [new Category({ name: 'test' }), new Category({ name: 'fake' }), new Category({ name: 'TEst' })];
    const filterSpy = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, 'test');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(filteredItems).toStrictEqual([items[0], items[2]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: 'test', created_at }),
      new Category({ name: 'fake', created_at: new Date(created_at.getTime() + 200) }),
      new Category({ name: 'TEst', created_at: new Date(created_at.getTime() + 100) }),
    ];

    let sortedItems = await repository['applySort'](items, null, null);
    expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      new Category({ name: 'd' }),
      new Category({ name: 'b' }),
      new Category({ name: 'e' }),
      new Category({ name: 'a' }),
      new Category({ name: 'c' }),
    ];

    let sortedItems = await repository['applySort'](items, 'name', 'asc');
    expect(sortedItems).toStrictEqual([items[3], items[1], items[4], items[0], items[2]]);

    sortedItems = await repository['applySort'](items, 'name', 'desc');
    expect(sortedItems).toStrictEqual([items[2], items[0], items[4], items[1], items[3]]);
  });
});