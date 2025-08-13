import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';

export interface HouseholdMember extends HouseholdMembership {
  fullName: string;
}

export class ListHouseholdMembersUseCase {
  constructor(
    private membershipRepo: HouseholdMembershipRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(householdId: string): Promise<HouseholdMember[]> {
    const memberships =
      await this.membershipRepo.findActiveByHousehold(householdId);
    const users = await Promise.all(
      memberships.map((m) => this.userRepo.findById(m.userId)),
    );
    return memberships.map((m, idx) => ({
      ...m,
      fullName: users[idx]?.fullName ?? '',
    }));
  }
}
