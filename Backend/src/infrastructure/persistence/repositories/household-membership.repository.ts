import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { HouseholdMembershipModel } from '../models/household-membership.schema';
import { MembershipStatus } from '../../../domain/models/enums/membership-status.enum';

export class HouseholdMembershipRepository {
  async create(
    membership: Omit<HouseholdMembership, 'id'>,
  ): Promise<HouseholdMembership> {
    const created = await HouseholdMembershipModel.create(membership);
    return {
      id: created.id,
      ...created.toObject(),
    } as unknown as HouseholdMembership;
  }

  async findByUserAndHousehold(
    userId: string,
    householdId: string,
  ): Promise<HouseholdMembership | null> {
    return (await HouseholdMembershipModel.findOne({
      userId,
      householdId,
    }).lean()) as HouseholdMembership | null;
  }

  async findById(id: string): Promise<HouseholdMembership | null> {
    return (await HouseholdMembershipModel.findById(
      id,
    ).lean()) as HouseholdMembership | null;
  }

  async updateStatus(
    id: string,
    status: MembershipStatus,
  ): Promise<HouseholdMembership | null> {
    const update: Partial<HouseholdMembership> = { status };
    if (status === MembershipStatus.ACTIVE) {
      update.joinedAt = new Date();
    }
    return (await HouseholdMembershipModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean()) as HouseholdMembership | null;
  }
}
