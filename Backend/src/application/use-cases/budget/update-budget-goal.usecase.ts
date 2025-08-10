import { BudgetGoalType } from '../../../domain/models/enums/budget-goal-type.enum';
import { Household } from '../../../domain/models/household.model';
import { BudgetChangeRepository } from '../../../infrastructure/persistence/repositories/budget-change.repository';
import { HouseholdRepository } from '../../../infrastructure/persistence/repositories/household.repository';
import { DomainEventBus } from '../../../domain/events/domain-event-bus.interface';
import { BudgetGoalUpdatedEvent } from '../../../domain/events/budget.events';

export interface UpdateBudgetGoalPayload {
  amount: number;
  targetDate?: Date;
  reason?: string;
}

export class UpdateBudgetGoalUseCase {
  constructor(
    private householdRepo: HouseholdRepository,
    private changeRepo: BudgetChangeRepository,
    private eventBus: DomainEventBus,
  ) {}

  async execute(
    userId: string,
    householdId: string,
    type: BudgetGoalType,
    payload: UpdateBudgetGoalPayload,
  ): Promise<Household | null> {
    const household = await this.householdRepo.findById(householdId);
    if (!household) return null;

    const previousAmount =
      type === BudgetGoalType.INITIAL
        ? household.initialBudgetGoal?.amount || 0
        : household.monthlyBudgetGoal || 0;

    const update: Partial<Household> = {};
    if (type === BudgetGoalType.INITIAL) {
      const goal: Household['initialBudgetGoal'] = { amount: payload.amount };
      if (payload.targetDate) {
        goal.targetDate = payload.targetDate;
      }
      update.initialBudgetGoal = goal;
    } else {
      update.monthlyBudgetGoal = payload.amount;
    }

    const updated = await this.householdRepo.update(householdId, update);

    const timestamp = new Date();
    await this.changeRepo.create({
      householdId,
      type,
      previousAmount,
      newAmount: payload.amount,
      currency: household.baseCurrency,
      userId,
      timestamp,
      ...(payload.reason ? { reason: payload.reason } : {}),
    });

    const event: BudgetGoalUpdatedEvent = {
      type: 'BudgetGoalUpdated',
      occurredOn: timestamp,
      householdId,
      userId,
      goalType: type,
      previousAmount,
      newAmount: payload.amount,
    };
    await this.eventBus.publish(event);

    return updated;
  }
}
