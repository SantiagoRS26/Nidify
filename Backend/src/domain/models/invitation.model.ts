import { InvitationStatus } from './enums/invitation-status.enum';

/** Pending invitation for a user to join a household */
export interface Invitation {
  /** Unique identifier */
  id: string;
  /** Destination household */
  householdId: string;
  /** Invited email if applicable */
  email?: string;
  /** Secure token used for acceptance */
  token: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Expiration timestamp */
  expiresAt?: Date;
  /** Invitation status */
  status: InvitationStatus;
  /** User who generated the invitation */
  invitedBy: string;
  /** Medium used (email, direct link, etc.) */
  medium?: string;
  /** Number of times the token was attempted */
  usageAttempts: number;
}
