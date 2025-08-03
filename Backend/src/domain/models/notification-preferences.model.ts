/** User notification preferences */
export interface NotificationPreferences {
  /** Unique identifier */
  id: string;
  /** User owner */
  userId: string;
  /** Optional household context */
  householdId?: string;
  /** Enabled alerts */
  alerts: {
    /** Alert when initial or monthly budget is exceeded */
    budgetExceeded?: boolean;
    /** Reminder for monthly services */
    monthlyServiceReminder?: boolean;
  };
  /** Preferred delivery mediums, e.g., ['in_app', 'email'] */
  mediums: string[];
  /** Custom thresholds by alert type */
  thresholds?: {
    /** Budget usage threshold (0-1) */
    budgetUsage?: number;
  };
}
