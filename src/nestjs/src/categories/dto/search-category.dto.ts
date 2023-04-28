import { ListCategoriesUseCase } from "@app/micro-videos/category/application";
import { SortDirection } from "@app/micro-videos/dist/shared/domain/repository/repository-contracts";

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}