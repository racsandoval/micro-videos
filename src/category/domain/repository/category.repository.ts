import { SearchableRepositoryInterface, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "../../../shared/domain/repository/repository-contracts";
import { Category } from "../entity/category";

export namespace CategoryRepository {
  export type Filter = string;
  
  export class SearchParams extends DefaultSearchParams<Filter> {}
  
  export class SearchResult extends DefaultSearchResult<Category, Filter> {}
  
  export interface Repository extends SearchableRepositoryInterface<
    Category,
    Filter,
    SearchResult,
    SearchParams
  > {}
}

export default CategoryRepository;
