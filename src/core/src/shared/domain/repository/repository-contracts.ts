import Entity from '../entity/entity';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
}

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _per_page: number = 15;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let page = +value;

    if (Number.isNaN(page) || page <= 0 || parseInt(page as any) !== page) {
      page = 1
    }

    this._page = page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    let per_page = typeof value === 'boolean' ? this._per_page : +value;

    if (Number.isNaN(per_page) || per_page <= 0 || parseInt(per_page as any) !== per_page) {
      per_page = 15
    }

    this._per_page = per_page;
  }

  get sort() {
    return this._sort;
  }
  
  private set sort(value: string) {
    this._sort = value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter = value === null || value === undefined || (value as any) === '' ? null : `${value}` as any;
  }
}

export type SearchResultProps<E, Filter> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
  sort: string | null;
  sort_dir: string | null;
  filter: Filter | null;
}

export class SearchResult<E extends Entity = Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;
  readonly sort: string | null;
  readonly sort_dir: string | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    }
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchOutput = SearchResult<E, Filter>,
  SearchInput = SearchParams<Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}