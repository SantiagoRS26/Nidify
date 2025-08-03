import { ChangelogChangeType } from './enums/changelog-change-type.enum';
import { ChangelogEntityType } from './enums/changelog-entity-type.enum';

/** Audit log entry for significant changes */
export interface ChangelogEntry {
  /** Unique identifier */
  id: string;
  /** Associated household */
  householdId: string;
  /** Type of entity affected */
  entityType: ChangelogEntityType;
  /** Identifier of the affected entity */
  entityId: string;
  /** Type of change */
  changeType: ChangelogChangeType;
  /** Human readable description */
  description: string;
  /** Optional structured diff with before/after values */
  diff?: Record<string, unknown>;
  /** User who executed the change */
  userId: string;
  /** Denormalized user name */
  userName: string;
  /** Timestamp of the change */
  timestamp: Date;
  /** Extra metadata */
  metadata?: Record<string, unknown>;
}
