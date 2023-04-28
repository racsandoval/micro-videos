import { Sequelize } from 'sequelize-typescript';
import { LoadEntityError } from '#core/domain';
import { CategoryModelMapper } from './category.mapper';
import { CategoryModel } from './category.model';
import { CategorySequelizeRepository } from './category.repository';

describe('CategoryModelMapper Unit Test', () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [CategoryModel],
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should throw error when category is invalid', () => {
    // @ts-ignore
    const model = CategoryModel.build({ id: 'cf317fac-e99b-4917-97fd-fcb11320a9ad' });
    try {
      CategoryModelMapper.toEntity(model);
      fail('Did not throw LoadEntityError');
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })
    }
  });
});