import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';

export class RevokeMembershipUseCase {
  constructor(private membershipRepo: HouseholdMembershipRepository) {}

  async execute(
    adminUserId: string,
    householdId: string,
    memberId: string,
  ): Promise<void> {
    const admin = await this.membershipRepo.findByUserAndHousehold(
      adminUserId,
      householdId,
    );
    if (
      !admin ||
      admin.role !== MembershipRole.ADMIN ||
      admin.status !== MembershipStatus.ACTIVE
    ) {
      throw new Error('No autorizado');
    }

    const target = await this.membershipRepo.findById(memberId);
    if (!target || target.householdId !== householdId) {
      throw new Error('Membresía no encontrada');
    }

    await this.membershipRepo.updateStatus(target.id, MembershipStatus.REVOKED);
  }
}
