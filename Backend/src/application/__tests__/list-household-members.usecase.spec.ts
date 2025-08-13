/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { ListHouseholdMembersUseCase } from '../use-cases/household/list-members.usecase';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';
import { UserStatus } from '../../domain/models/enums/user-status.enum';

describe('ListHouseholdMembersUseCase', () => {
  let mongo: MongoMemoryServer;
  let repo: HouseholdMembershipRepository;
  let userRepo: UserRepository;
  let listMembers: ListHouseholdMembersUseCase;

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
    repo = new HouseholdMembershipRepository();
    userRepo = new UserRepository();
    listMembers = new ListHouseholdMembersUseCase(repo, userRepo);
  });

  it('returns active members for a household', async () => {
    const householdId = 'h1';
    const user1 = await userRepo.create({
      fullName: 'User 1',
      email: 'u1@test.com',
      passwordHash: 'h',
      oauthProviders: [],
      preferredCurrency: 'USD',
      locale: 'es',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
    const user2 = await userRepo.create({
      fullName: 'User 2',
      email: 'u2@test.com',
      passwordHash: 'h',
      oauthProviders: [],
      preferredCurrency: 'USD',
      locale: 'es',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
    await repo.create({
      userId: user1.id,
      householdId,
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    });
    await repo.create({
      userId: user2.id,
      householdId,
      role: MembershipRole.MEMBER,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    });
    await repo.create({
      userId: 'u3',
      householdId: 'h2',
      role: MembershipRole.MEMBER,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    });
    await repo.create({
      userId: 'u4',
      householdId,
      role: MembershipRole.MEMBER,
      status: MembershipStatus.REVOKED,
      joinedAt: new Date(),
    });

    const members = await listMembers.execute(householdId);
    expect(members).toHaveLength(2);
    expect(members.map((m) => m.userId)).toEqual(
      expect.arrayContaining([user1.id, user2.id]),
    );
    expect(members.map((m) => m.fullName)).toEqual(
      expect.arrayContaining(['User 1', 'User 2']),
    );
  });
});
