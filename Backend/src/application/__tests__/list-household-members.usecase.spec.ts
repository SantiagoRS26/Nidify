/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { ListHouseholdMembersUseCase } from '../use-cases/household/list-members.usecase';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';

describe('ListHouseholdMembersUseCase', () => {
  let mongo: MongoMemoryServer;
  let repo: HouseholdMembershipRepository;
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
    listMembers = new ListHouseholdMembersUseCase(repo);
  });

  it('returns active members for a household', async () => {
    const householdId = 'h1';
    await repo.create({
      userId: 'u1',
      householdId,
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    });
    await repo.create({
      userId: 'u2',
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
      expect.arrayContaining(['u1', 'u2']),
    );
  });
});
