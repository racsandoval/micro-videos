import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from '@app/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@app/micro-videos/category/infra';
import CategoryRepository from '@app/micro-videos/dist/category/domain/repository/category.repository';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const IN_MEMORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    }
  }

  export namespace USE_CASES {
    export const CREATE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => new CreateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.IN_MEMORY.provide]
    }

    export const UPDATE = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => new ListCategoriesUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.IN_MEMORY.provide]
    }

    export const LIST = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => new UpdateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.IN_MEMORY.provide]
    }

    export const DELETE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => new DeleteCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.IN_MEMORY.provide]
    }

    export const GET = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => new GetCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.IN_MEMORY.provide]
    }
  }
}