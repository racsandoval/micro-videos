import CategoryRepository from '../../domain/repository/category.repository';
import { CategoryOutput, CategoryOutputMapper } from '../dto/category-output';
import { default as DefaultUseCase } from '../../../shared/application/use-case';

export namespace UpdateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
      entity.update({ name: input.name, description: input.description });

      if (typeof input.is_active === 'boolean') {
        input.is_active ? entity.activate() : entity.deactivate();
      }

      await this.categoryRepo.update(entity);
      return CategoryOutputMapper.toOutput(entity)
    }
  }

  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  }

  export type Output = CategoryOutput;
}

export default UpdateCategoryUseCase;