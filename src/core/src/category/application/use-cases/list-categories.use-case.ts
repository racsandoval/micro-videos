import CategoryRepository from '../../domain/repository/category.repository';
import { CategoryOutput, CategoryOutputMapper } from '../dto/category-output';
import { default as DefaultUseCase } from '../../../shared/application/use-case';
import { SearchInputDto } from '../../../shared/application/dto/search-input';
import { PaginationOutputDto, PaginationOutputMapper } from '../../../shared/application/dto/pagination-output';

export namespace ListCategoriesUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const params = new CategoryRepository.SearchParams(input);
      const searchResult = await this.categoryRepo.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
      return {
        items: searchResult.items.map((entity) => CategoryOutputMapper.toOutput(entity)),
        ...PaginationOutputMapper.toOutput(searchResult),
      }
    }
  }

  export type Input = SearchInputDto<CategoryRepository.Filter>;

  export type Output = PaginationOutputDto<CategoryOutput>;
}

export default ListCategoriesUseCase;
