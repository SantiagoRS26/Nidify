import { randomUUID } from 'crypto';
import { InvitationRepository } from '../../../infrastructure/persistence/repositories/invitation.repository';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { EmailService } from '../../../infrastructure/notifications/email.service';
import { MembershipRole } from '../../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../../domain/models/enums/membership-status.enum';
import { InvitationStatus } from '../../../domain/models/enums/invitation-status.enum';
import { Invitation } from '../../../domain/models/invitation.model';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';

export class InviteToHouseholdUseCase {
  constructor(
    private membershipRepo: HouseholdMembershipRepository,
    private invitationRepo: InvitationRepository,
    private userRepo: UserRepository,
    private emailService: EmailService,
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
      throw new UnauthorizedError('No autorizado');
    }

    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const invitation = await this.invitationRepo.create({
      householdId,
      email,
      token,
      createdAt: now,
      expiresAt,
      status: InvitationStatus.PENDING,
      invitedBy: inviterId,
      usageAttempts: 0,
    });

    await this.emailService.sendInvitation(email, token);

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
