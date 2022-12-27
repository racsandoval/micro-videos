import { SortDirection } from 'shared/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../shared/domain/repository/in-memory.repository';
import { Category } from '../../domain/entity/category';
import CategoryRepository from '../../domain/repository/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(items: Category[], filter: CategoryRepository.Filter | null): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => i.props.name.toLowerCase().includes(filter.toLowerCase()));
  }

  protected async applySort(items: Category[], sort: string | null, sort_dir: SortDirection | null): Promise<Category[]> {
    return sort ? super.applySort(items, sort, sort_dir) : super.applySort(items, 'created_at', 'desc');
  }
}

export default CategoryInMemoryRepository;