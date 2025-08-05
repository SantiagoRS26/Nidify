import { InvitationRepository } from '../../infrastructure/persistence/repositories/invitation.repository';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { InvitationStatus } from '../../domain/models/enums/invitation-status.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { HouseholdMembership } from '../../domain/models/household-membership.model';
import { BadRequestError } from '../../domain/errors/bad-request.error';
import { ConflictError } from '../../domain/errors/conflict.error';

export class AcceptInvitationUseCase {
  constructor(
    private invitationRepo: InvitationRepository,
    private membershipRepo: HouseholdMembershipRepository,
  ) {}

  async execute(token: string, userId: string): Promise<HouseholdMembership> {
    const invitation = await this.invitationRepo.findByToken(token);
    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestError('Invitación inválida');
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      await this.invitationRepo.update(invitation.id, {
        status: InvitationStatus.EXPIRED,
        usageAttempts: invitation.usageAttempts + 1,
      });
      throw new BadRequestError('Invitación expirada');
    }

    await this.invitationRepo.update(invitation.id, {
      status: InvitationStatus.ACCEPTED,
      usageAttempts: invitation.usageAttempts + 1,
    });

    const existing = await this.membershipRepo.findByUserAndHousehold(
      userId,
      invitation.householdId,
    );
    if (existing) {
      const updated = await this.membershipRepo.updateStatus(
        existing.id,
        MembershipStatus.ACTIVE,
      );
      if (!updated) {
        throw new ConflictError('No se pudo actualizar la membresía');
      }
      return updated;
    }

    const now = new Date();
    const membership = await this.membershipRepo.create({
      userId,
      householdId: invitation.householdId,
      role: MembershipRole.MEMBER,
      status: MembershipStatus.ACTIVE,
      joinedAt: now,
      invitedBy: invitation.invitedBy,
    });

    return membership;
  }
}
