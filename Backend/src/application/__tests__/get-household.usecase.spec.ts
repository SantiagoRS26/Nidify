/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HouseholdRepository } from '../../infrastructure/persistence/repositories/household.repository';
import { GetHouseholdUseCase } from '../use-cases/get-household.usecase';

describe('GetHouseholdUseCase', () => {
  let mongo: MongoMemoryServer;
  let repo: HouseholdRepository;
  let getHousehold: GetHouseholdUseCase;

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
    repo = new HouseholdRepository();
    getHousehold = new GetHouseholdUseCase(repo);
  });

  it('returns household by id', async () => {
    const created = await repo.create({
      name: 'Test',
      baseCurrency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const found = await getHousehold.execute(created.id);
    expect(found).toBeTruthy();
    expect(found?.id).toBe(created.id);
  });
});
