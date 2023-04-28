import { CategoryModel } from './category.model';
import { Category } from '#category/domain';
import { EntityValidationError, LoadEntityError, UniqueEntityId } from '#core/domain';

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const { id, ...otherFields } = model.toJSON();
    const uniqueEntityId = new UniqueEntityId(id);
    try {
      return new Category(otherFields, uniqueEntityId);
    } catch (error) {
      if (error instanceof EntityValidationError) {
        throw new LoadEntityError(error.error);
      }

      throw error;
    }
  }
}