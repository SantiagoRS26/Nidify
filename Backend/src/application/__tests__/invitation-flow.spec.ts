/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InviteToHouseholdUseCase } from '../use-cases/household/invite-to-household.usecase';
import { AcceptInvitationUseCase } from '../use-cases/household/accept-invitation.usecase';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { InvitationRepository } from '../../infrastructure/persistence/repositories/invitation.repository';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { EmailService } from '../../infrastructure/notifications/email.service';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';
import { UserStatus } from '../../domain/models/enums/user-status.enum';
import { InvitationStatus } from '../../domain/models/enums/invitation-status.enum';

describe('Household invitation flow', () => {
  let mongo: MongoMemoryServer;
  let membershipRepo: HouseholdMembershipRepository;
  let invitationRepo: InvitationRepository;
  let userRepo: UserRepository;
  let emailService: EmailService;
  let inviteUseCase: InviteToHouseholdUseCase;
  let acceptUseCase: AcceptInvitationUseCase;

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
    membershipRepo = new HouseholdMembershipRepository();
    invitationRepo = new InvitationRepository();
    userRepo = new UserRepository();
    emailService = new EmailService();
    inviteUseCase = new InviteToHouseholdUseCase(
      membershipRepo,
      invitationRepo,
      userRepo,
      emailService,
    );
    acceptUseCase = new AcceptInvitationUseCase(invitationRepo, membershipRepo);
  });

  it('creates an invitation and activates membership upon acceptance', async () => {
    const householdId = 'house1';
    const inviterId = 'admin1';
    await membershipRepo.create({
      userId: inviterId,
      householdId,
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    });

    const invitedUser = await userRepo.create({
      fullName: 'Invited User',
      email: 'invited@example.com',
      passwordHash: 'hash',
      oauthProviders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.ACTIVE,
    });

    const invitation = await inviteUseCase.execute(
      inviterId,
      householdId,
      invitedUser.email,
    );
    expect(invitation.status).toBe(InvitationStatus.PENDING);

    const pendingMembership = await membershipRepo.findByUserAndHousehold(
      invitedUser.id,
      householdId,
    );
    expect(pendingMembership?.status).toBe(MembershipStatus.PENDING);

    const membership = await acceptUseCase.execute(
      invitation.token,
      invitedUser.id,
    );
    expect(membership.status).toBe(MembershipStatus.ACTIVE);
    expect(membership.householdId).toBe(householdId);

    const storedInvitation = await invitationRepo.findById(invitation.id);
    expect(storedInvitation?.status).toBe(InvitationStatus.ACCEPTED);
  });
});
