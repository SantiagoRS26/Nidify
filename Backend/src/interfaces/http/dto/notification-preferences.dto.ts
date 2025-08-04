export interface NotificationPreferencesDto {
  alerts?: {
    budgetExceeded?: boolean;
    monthlyServiceReminder?: boolean;
  };
  mediums?: string[];
  thresholds?: {
    budgetUsage?: number;
  };
}
