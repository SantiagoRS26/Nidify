import { AlertType } from './enums/alert-type.enum';

/** In-app alert for users */
export interface Alert {
  /** Unique identifier */
  id: string;
  /** User that receives the alert */
  userId: string;
  /** Related household if applicable */
  householdId?: string;
  /** Alert type */
  type: AlertType;
  /** Human readable message */
  message: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Whether the alert has been read */
  read: boolean;
}
