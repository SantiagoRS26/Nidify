import { MembershipRole } from './enums/membership-role.enum';
import { MembershipStatus } from './enums/membership-status.enum';

/** Association between a user and a household */
export interface HouseholdMembership {
  /** Unique identifier */
  id: string;
  /** Referenced user */
  userId: string;
  /** Referenced household */
  householdId: string;
  /** Role within the household */
  role: MembershipRole;
  /** Membership status */
  status: MembershipStatus;
  /** When the user joined */
  joinedAt: Date;
  /** User who invited the member */
  invitedBy?: string;
}
