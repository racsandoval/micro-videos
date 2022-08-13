import UniqueEntityId from '../value-objects/unique-entity-id.vo';
import Entity from './entity';
import { validate as uuidValidate } from 'uuid';

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}

describe('Entity Unit Tests', () => {
  it('should set props and id', () => {
    const arrange = { prop1: 'prop1', prop2: 10 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(uuidValidate(entity.id)).toBeTruthy;
  });

  it('should accept a valid uuid', () => {
    const arrange = { prop1: 'prop1', prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it('should convert a entity to JSON', () => {
    const arrange = { prop1: 'prop1', prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.toJson()).toStrictEqual({
      id: entity.id,
      ...arrange,
    })
  });
});