import { randomUUID } from 'crypto';
import { InvitationRepository } from '../../infrastructure/persistence/repositories/invitation.repository';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';
import { InvitationStatus } from '../../domain/models/enums/invitation-status.enum';
import { Invitation } from '../../domain/models/invitation.model';

export class InviteToHouseholdUseCase {
  constructor(
    private membershipRepo: HouseholdMembershipRepository,
    private invitationRepo: InvitationRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(
    inviterId: string,
    householdId: string,
    email: string,
  ): Promise<Invitation> {
    const inviter = await this.membershipRepo.findByUserAndHousehold(
      inviterId,
      householdId,
    );
    if (
      !inviter ||
      inviter.role !== MembershipRole.ADMIN ||
      inviter.status !== MembershipStatus.ACTIVE
    ) {
      throw new Error('No autorizado');
    }

    const token = randomUUID();
    const now = new Date();
    const invitation = await this.invitationRepo.create({
      householdId,
      email,
      token,
      createdAt: now,
      status: InvitationStatus.PENDING,
      invitedBy: inviterId,
      usageAttempts: 0,
    });

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      await this.membershipRepo.create({
        userId: existingUser.id,
        householdId,
        role: MembershipRole.MEMBER,
        status: MembershipStatus.PENDING,
        joinedAt: now,
        invitedBy: inviterId,
      });
    }

    return invitation;
  }
}
