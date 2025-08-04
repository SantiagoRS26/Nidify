export interface MemberBudgetTotals {
  userId: string;
  initial: number;
  monthly: number;
}

export interface BudgetSummary {
  householdId: string;
  currency: string;
  initialTotal: number;
  monthlyTotal: number;
  memberTotals: MemberBudgetTotals[];
  initialGoal?: number;
  monthlyGoal?: number;
  initialExceeded: boolean;
  monthlyExceeded: boolean;
}
