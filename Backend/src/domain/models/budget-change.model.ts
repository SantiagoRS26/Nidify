import { BudgetGoalType } from './enums/budget-goal-type.enum';

/** Versioned change to household budget goals */
export interface BudgetChange {
  /** Unique identifier */
  id: string;
  /** Household affected */
  householdId: string;
  /** Which goal changed */
  type: BudgetGoalType;
  /** Previous amount */
  previousAmount: number;
  /** New amount */
  newAmount: number;
  /** Currency ISO code */
  currency: string;
  /** User who made the change */
  userId: string;
  /** Timestamp of change */
  timestamp: Date;
  /** Optional reason */
  reason?: string;
}
