import { InvitationRepository } from '../../../infrastructure/persistence/repositories/invitation.repository';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { InvitationStatus } from '../../../domain/models/enums/invitation-status.enum';
import { MembershipRole } from '../../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../../domain/models/enums/membership-status.enum';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import { NotFoundError } from '../../../domain/errors/not-found.error';

export class CancelInvitationUseCase {
  constructor(
    private membershipRepo: HouseholdMembershipRepository,
    private invitationRepo: InvitationRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(
    userId: string,
    householdId: string,
    invitationId: string,
  ): Promise<void> {
    const inviter = await this.membershipRepo.findByUserAndHousehold(
      userId,
      householdId,
    );
    if (
      !inviter ||
      inviter.role !== MembershipRole.ADMIN ||
      inviter.status !== MembershipStatus.ACTIVE
    ) {
      throw new UnauthorizedError('No autorizado');
    }

    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation || invitation.householdId !== householdId) {
      throw new NotFoundError('Invitación no encontrada');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return;
    }

    await this.invitationRepo.update(invitation.id, {
      status: InvitationStatus.CANCELLED,
    });

    if (invitation.email) {
      const user = await this.userRepo.findByEmail(invitation.email);
      if (user) {
        const membership = await this.membershipRepo.findByUserAndHousehold(
          user.id,
          householdId,
        );
        if (membership && membership.status === MembershipStatus.PENDING) {
          await this.membershipRepo.updateStatus(
            membership.id,
            MembershipStatus.REVOKED,
          );
        }
      }
    }
  }
}
