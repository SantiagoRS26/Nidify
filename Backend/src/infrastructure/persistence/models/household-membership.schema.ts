import { Schema, model, Document } from 'mongoose';
import { HouseholdMembership } from '../../../domain/models/household-membership.model';
import { MembershipRole } from '../../../domain/models/enums/membership-role.enum';
import { MembershipStatus } from '../../../domain/models/enums/membership-status.enum';

interface HouseholdMembershipDocument
  extends Document,
    Omit<HouseholdMembership, 'id'> {}

const HouseholdMembershipSchema = new Schema<HouseholdMembershipDocument>({
  userId: { type: String, required: true },
  householdId: { type: String, required: true },
  role: { type: String, enum: Object.values(MembershipRole), required: true },
  status: {
    type: String,
    enum: Object.values(MembershipStatus),
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
  invitedBy: { type: String },
});

export const HouseholdMembershipModel = model<HouseholdMembershipDocument>(
  'HouseholdMembership',
  HouseholdMembershipSchema,
);
