import {
  BudgetSummary,
  MemberBudgetTotals,
} from '../../../domain/models/budget-summary.model';
import { ItemType } from '../../../domain/models/enums/item-type.enum';
import { ItemStatus } from '../../../domain/models/enums/item-status.enum';
import { HouseholdRepository } from '../../../infrastructure/persistence/repositories/household.repository';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';

export class GetBudgetSummaryUseCase {
  constructor(
    private householdRepo: HouseholdRepository,
    private itemRepo: ItemRepository,
  ) {}

  async execute(householdId: string): Promise<BudgetSummary | null> {
    const household = await this.householdRepo.findById(householdId);
    if (!household) return null;

    const items = await this.itemRepo.findByHousehold(householdId);
    let initialTotal = 0;
    let monthlyTotal = 0;
    const memberTotalsMap: Record<string, MemberBudgetTotals> = {};

    for (const item of items) {
      if (item.status === ItemStatus.DISCARDED) continue;
      if (item.type === ItemType.ONE_TIME) {
        initialTotal += item.price;
      } else if (item.type === ItemType.RECURRING) {
        monthlyTotal += item.price;
      }
      if (item.paymentSplit) {
        for (const assignment of item.paymentSplit.assignments) {
          if (!memberTotalsMap[assignment.userId]) {
            memberTotalsMap[assignment.userId] = {
              userId: assignment.userId,
              initial: 0,
              monthly: 0,
            };
          }
          const totals = memberTotalsMap[assignment.userId]!;
          if (item.type === ItemType.ONE_TIME) {
            totals.initial += assignment.calculatedAmount ?? 0;
          } else if (item.type === ItemType.RECURRING) {
            totals.monthly += assignment.calculatedAmount ?? 0;
          }
        }
      }
    }

    const memberTotals = Object.values(memberTotalsMap);
    const initialGoal = household.initialBudgetGoal?.amount;
    const monthlyGoal = household.monthlyBudgetGoal;

    const summary: BudgetSummary = {
      householdId,
      currency: household.baseCurrency,
      initialTotal,
      monthlyTotal,
      memberTotals,
      initialExceeded: initialGoal ? initialTotal > initialGoal : false,
      monthlyExceeded: monthlyGoal ? monthlyTotal > monthlyGoal : false,
    };
    if (initialGoal !== undefined) {
      summary.initialGoal = initialGoal;
    }
    if (monthlyGoal !== undefined) {
      summary.monthlyGoal = monthlyGoal;
    }
    return summary;
  }
}
