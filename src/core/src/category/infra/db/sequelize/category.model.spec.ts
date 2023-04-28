import { DataType, Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category.model';

describe('CategoryModel Unit Tests', () => {
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

  test('create', async () => {
    const arrange = {
      id: 'cf317fac-e99b-4917-97fd-fcb11320a9ad',
      name: 'Movie',
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange)
  });

  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);

    expect(attributes).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at']);

    expect(attributesMap.id).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(attributesMap.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(attributesMap.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(attributesMap.is_active).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    expect(attributesMap.created_at).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(),
    });
  });
});