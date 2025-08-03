import { Household } from '../../domain/models/household.model';
import { HouseholdRepository } from '../../infrastructure/persistence/repositories/household.repository';
import { HouseholdMembershipRepository } from '../../infrastructure/persistence/repositories/household-membership.repository';
import { MembershipRole } from '../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../domain/models/enums/membership-status.enum';

export class CreateHouseholdUseCase {
  constructor(
    private householdRepo: HouseholdRepository,
    private membershipRepo: HouseholdMembershipRepository,
  ) {}

  async execute(
    userId: string,
    name: string,
    baseCurrency: string,
  ): Promise<Household> {
    const now = new Date();
    const household = await this.householdRepo.create({
      name,
      baseCurrency,
      createdAt: now,
      updatedAt: now,
    });

    await this.membershipRepo.create({
      userId,
      householdId: household.id,
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      joinedAt: now,
      invitedBy: userId,
    });

    return household;
  }
}
