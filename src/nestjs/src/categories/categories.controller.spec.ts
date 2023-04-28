import { CreateCategoryUseCase, ListCategoriesUseCase } from '@app/micro-videos/category/application';
import { SearchParams } from '@app/micro-videos/shared/domain';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: 'cf317fac-e99b-4917-97fd-fcb11320a9ad',
      created_at: new Date(),
      name: 'Movie',
      description: 'some description',
      is_active: true,
    }

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCategoryDto = { name: 'Movie', description: 'some description', is_active: true };
    const res = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(res).toStrictEqual(output);
  });

  it('should update a category', async () => {
    const id = 'cf317fac-e99b-4917-97fd-fcb11320a9ad';
    const output: CreateCategoryUseCase.Output = {
      id,
      created_at: new Date(),
      name: 'Movie',
      description: 'some description',
      is_active: true,
    }

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateCategoryDto = { name: 'Movie', description: 'some description', is_active: true };
    const res = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(res).toStrictEqual(output);
  });

  it('should delete a category', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = 'cf317fac-e99b-4917-97fd-fcb11320a9ad';
    const res = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(res).toStrictEqual(undefined);
  });

  it('should get a category', async () => {
    const id = 'cf317fac-e99b-4917-97fd-fcb11320a9ad';
    const output: CreateCategoryUseCase.Output = {
      id,
      created_at: new Date(),
      name: 'Movie',
      description: 'some description',
      is_active: true,
    }

    const mockGetUseCAse = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['getUseCase'] = mockGetUseCAse;

    const res = await controller.findOne(id);
    expect(mockGetUseCAse.execute).toHaveBeenCalledWith({ id });
    expect(res).toStrictEqual(output);
  });

  it('should list categories', async () => {
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id: 'cf317fac-e99b-4917-97fd-fcb11320a9ad',
          created_at: new Date(),
          name: 'Movie',
          description: 'some description',
          is_active: true,
        }
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    }

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;

    const searchParams = new SearchParams({
      page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
    });
    const res = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(res).toStrictEqual(output);
  });
});
