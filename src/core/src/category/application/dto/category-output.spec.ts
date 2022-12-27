import { Category } from "../../domain/entity/category";
import { CategoryOutputMapper } from "./category-output";

describe('CategoryOutputMapper Unit Test', () => {
  it('should convert a category in output', () => {
    const created_at = new Date();
    const entity = new Category({
      name: 'Movie',
      description: 'som description',
      is_active: true,
      created_at,
    });
    const spyToJson = jest.spyOn(entity, 'toJson');

    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'Movie',
      description: 'som description',
      is_active: true,
      created_at,
    })
  });
});