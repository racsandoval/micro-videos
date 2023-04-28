import Entity from '../../entity/entity';
import NotFoundError from '../../errors/not-found.error';
import UniqueEntityId from '../../value-objects/unique-entity-id.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> { }

class StubInMemoryRepository extends InMemoryRepository<StubEntity> { }

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 })
    await repository.insert(entity);
    expect(repository.items).toHaveLength(1);
    expect(entity).toStrictEqual(repository.items[0])
  });

  it('should throw error when entity not found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'))

    await expect(repository.findById(new UniqueEntityId('cf317fac-e99b-4917-97fd-fcb11320a9ad')))
      .rejects
      .toThrow(new NotFoundError('Entity not found using ID cf317fac-e99b-4917-97fd-fcb11320a9ad'))
  });

  it('should finds entity by id', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 })
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound).toStrictEqual(entity);

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound).toStrictEqual(entity);
  });

  it('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it('should throws error when updated entity does not exists', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 })
    expect(repository.update(entity)).rejects.toThrow(new NotFoundError(`Entity not found using ID ${entity.id}`));
  });

  it('should update entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity({ name: 'updated', price: 10 }, entity.uniqueEntityId);
    await repository.update(entityUpdated);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]).toStrictEqual(entityUpdated);
  });

  it('should throws error when delete entity does not exists', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 })
    expect(repository.delete(entity.id)).rejects.toThrow(new NotFoundError(`Entity not found using ID ${entity.id}`));
    expect(repository.delete(entity.uniqueEntityId)).rejects.toThrow(new NotFoundError(`Entity not found using ID ${entity.id}`));
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 100 });

    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});