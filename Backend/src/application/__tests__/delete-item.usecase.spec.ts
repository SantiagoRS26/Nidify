/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { DeleteItemUseCase } from '../use-cases/item/delete-item.usecase';
import { ItemType } from '../../domain/models/enums/item-type.enum';
import { DomainEventBus } from '../../domain/events/domain-event-bus.interface';

describe('DeleteItemUseCase', () => {
  let mongo: MongoMemoryServer;
  let repo: ItemRepository;
  let eventBus: DomainEventBus & {
    publish: jest.Mock;
    subscribe: jest.Mock;
  };
  let usecase: DeleteItemUseCase;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    repo = new ItemRepository();
    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn(),
    };
    usecase = new DeleteItemUseCase(repo, eventBus);
  });

  it('removes item and publishes event', async () => {
    const created = await repo.create({
      householdId: 'h1',
      name: 'Test',
      type: ItemType.ONE_TIME,
      price: 100,
      currency: 'USD',
      lastModifiedBy: 'u1',
    });

    const deleted = await usecase.execute('u1', created.id, 'User');

    expect(deleted?.id).toBe(created.id);
    const found = await repo.findById(created.id);
    expect(found).toBeNull();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ItemDeleted',
        householdId: 'h1',
        userId: 'u1',
      }),
    );
  });
});
