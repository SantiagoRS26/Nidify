/** Budget goals for a household */
export interface BudgetGoal {
  /** Target amount */
  amount: number;
  /** Optional deadline for the goal */
  targetDate?: Date;
}

/** Configuration for alerts, e.g., budget usage thresholds */
export interface HouseholdAlertsConfig {
  /** Trigger alert when usage exceeds this fraction (0-1) */
  budgetUsageThreshold?: number;
}

/** Household groups users and items */
export interface Household {
  /** Unique identifier */
  id: string;
  /** Display name, e.g., 'Andres and Julia' */
  name: string;
  /** Base currency ISO code */
  baseCurrency: string;
  /** Initial one-time budget goal */
  initialBudgetGoal?: BudgetGoal;
  /** Monthly recurring budget goal */
  monthlyBudgetGoal?: number;
  /** Optional alerts configuration */
  alertsConfig?: HouseholdAlertsConfig;
  /** Creation timestamp */
  createdAt: Date;
  /** Last modification timestamp */
  updatedAt: Date;
}
