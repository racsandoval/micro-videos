import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category.model';
import { CategorySequelizeRepository } from './category.repository';
import { Category } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#core/domain';

describe('CategorySequelizeRepository Unit Test', () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

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
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should insert a new entity', async () => {
    let category = new Category({ name: 'Movie' });
    await repository.insert(category);

    let model = await CategoryModel.findByPk(category.id);
    expect(model?.toJSON()).toStrictEqual(category.toJson());

    category = new Category({ name: 'Movie', description: 'some description', is_active: false });
    await repository.insert(category);

    model = await CategoryModel.findByPk(category.id);
    expect(model?.toJSON()).toStrictEqual(category.toJson());
  });

  it('should throw error when entity not found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));

    await expect(repository.findById(new UniqueEntityId('cf317fac-e99b-4917-97fd-fcb11320a9ad')))
      .rejects
      .toThrow(new NotFoundError('Entity not found using ID cf317fac-e99b-4917-97fd-fcb11320a9ad'));
  });

  it('should finds entity by id', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJson()).toStrictEqual(entity.toJson());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJson()).toStrictEqual(entity.toJson());
  });
});