import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';

export class ListHouseholdMembersUseCase {
  constructor(private membershipRepo: HouseholdMembershipRepository) {}

  async execute(householdId: string): Promise<HouseholdMembership[]> {
    return await this.membershipRepo.findActiveByHousehold(householdId);
  }
}
