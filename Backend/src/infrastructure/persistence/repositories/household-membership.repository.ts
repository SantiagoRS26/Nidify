import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { HouseholdMembershipModel } from '../models/household-membership.schema';
import { MembershipStatus } from '../../../domain/models/enums/membership-status.enum';

type MembershipRecord = Omit<HouseholdMembership, 'id'> & { _id: unknown };

export class HouseholdMembershipRepository {
  private toDomain(doc: MembershipRecord): HouseholdMembership {
    const { _id, ...membership } = doc;
    return { id: String(_id), ...membership } as HouseholdMembership;
  }

  async create(
    membership: Omit<HouseholdMembership, 'id'>,
  ): Promise<HouseholdMembership> {
    const created = await HouseholdMembershipModel.create(membership);
    return this.toDomain(created.toObject() as MembershipRecord);
  }

  async findByUserAndHousehold(
    userId: string,
    householdId: string,
  ): Promise<HouseholdMembership | null> {
    const doc = await HouseholdMembershipModel.findOne({
      userId,
      householdId,
    }).lean<MembershipRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<HouseholdMembership | null> {
    const doc =
      await HouseholdMembershipModel.findById(id).lean<MembershipRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async findActiveByUser(userId: string): Promise<HouseholdMembership[]> {
    const docs = await HouseholdMembershipModel.find({
      userId,
      status: MembershipStatus.ACTIVE,
    }).lean<MembershipRecord[]>();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findActiveByHousehold(
    householdId: string,
  ): Promise<HouseholdMembership[]> {
    const docs = await HouseholdMembershipModel.find({
      householdId,
      status: MembershipStatus.ACTIVE,
    }).lean<MembershipRecord[]>();
    return docs.map((doc) => this.toDomain(doc));
  }

  async updateStatus(
    id: string,
    status: MembershipStatus,
  ): Promise<HouseholdMembership | null> {
    const update: Partial<HouseholdMembership> = { status };
    if (status === MembershipStatus.ACTIVE) {
      update.joinedAt = new Date();
    }
    const updated = await HouseholdMembershipModel.findByIdAndUpdate(
      id,
      update,
      { new: true },
    ).lean<MembershipRecord>();
    return updated ? this.toDomain(updated) : null;
  }
}
