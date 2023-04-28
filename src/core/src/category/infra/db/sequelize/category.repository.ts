import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#core/domain';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './category.mapper';

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) { }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJson());
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const model = await this._get(`${id}`)
    return CategoryModelMapper.toEntity(model);
  }

  private async _get(id: string): Promise<CategoryModel> {
    const model = await this.categoryModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
    });

    return model;
  }

  //@ts-expect-error
  async findAll(): Promise<Category[]> {

  }

  async update(entity: Category): Promise<void> {

  }

  async delete(id: string | UniqueEntityId): Promise<void> {

  }

  //@ts-expect-error
  async search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {

  }
}