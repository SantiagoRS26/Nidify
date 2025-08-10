import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';

export class GetUserMembershipsUseCase {
  constructor(private membershipRepo: HouseholdMembershipRepository) {}

  async execute(userId: string): Promise<HouseholdMembership[]> {
    return await this.membershipRepo.findActiveByUser(userId);
  }
}
