import { DomainEvent } from './domain-event.interface';
import { BudgetGoalType } from '../models/enums/budget-goal-type.enum';

export interface BudgetGoalUpdatedEvent extends DomainEvent {
  type: 'BudgetGoalUpdated';
  householdId: string;
  userId: string;
  userName?: string;
  goalType: BudgetGoalType;
  previousAmount: number;
  newAmount: number;
}
