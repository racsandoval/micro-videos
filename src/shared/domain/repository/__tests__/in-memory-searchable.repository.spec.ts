import Entity from "../../entity/entity";
import { InMemorySearchableRepository } from '../in-memory.repository'
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    };

    return items.filter((i) => i.props.name.toLowerCase().includes(filter.toLowerCase()) || i.props.price.toString() === filter)
  }
}

describe('InMemotySearchableRepository Unit Tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should not filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 100 })];
      const filterMethodSpy = jest.spyOn(items, 'filter');
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(filterMethodSpy).not.toHaveBeenCalled;
    });

    it('should filter items using filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ];

      const filterMethodSpy = jest.spyOn(items, 'filter');

      let filteredItems = await repository['applyFilter'](items, 'TEST');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, '100');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 'no-filter');
      expect(filteredItems).toStrictEqual([]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should not sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'c', price: 110 }),
        new StubEntity({ name: 'a', price: 90 }),
      ];

      let sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(items);

      sortedItems = await repository['applySort'](items, 'price',  'asc');
      expect(sortedItems).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'c', price: 110 }),
        new StubEntity({ name: 'a', price: 90 }),
      ];

      let sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);

      sortedItems = await repository['applySort'](items, 'name',  'desc');
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
        new StubEntity({ name: 'd', price: 100 }),
        new StubEntity({ name: 'e', price: 100 }),
      ];
  
      let paginatedItems = await repository['applyPaginate'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);
        
      paginatedItems = await repository['applyPaginate'](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await repository['applyPaginate'](items, 3, 2);
      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await repository['applyPaginate'](items, 4, 2);
      expect(paginatedItems).toStrictEqual([]);

      paginatedItems = await repository['applyPaginate'](items, 1, 10);
      expect(paginatedItems).toStrictEqual([items[0], items[1], items[2], items[3], items[4]]);
    })
  });

  describe('search method', () => {
    it('should apply only paginate', async () => {
      const entity = new StubEntity({ name: 'a', price: 100 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      }));
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'fake', price: 50 }),
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'TeSt', price: 100 }),
      ];
      repository.items = items;

      let result = await repository.search(new SearchParams({
        page: 1,
        per_page: 2,
        filter: 'test',
      }));
      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'test',
      }));

      result = await repository.search(new SearchParams({
        page: 2,
        per_page: 2,
        filter: 'test',
      }));
      expect(result).toStrictEqual(new SearchResult({
        items: [items[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'test',
      }));
    });

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'd', price: 100 }),
        new StubEntity({ name: 'e', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort:  'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort:  'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort:  'name',
            sort_dir: 'desc',
            filter: null,
          })
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort:  'name',
            sort_dir: 'desc',
            filter: null,
          })
        }
      ];

      for(const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });

    it('should apply paginate, filter and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'TeSt', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'test' }),
          result: new SearchResult({
            items: [items[2], items[3]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort:  'name',
            sort_dir: 'asc',
            filter:  'test',
          })
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort:  'name',
            sort_dir: 'asc',
            filter: 'TEST',
          })
        },
      ];

      for(const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
});