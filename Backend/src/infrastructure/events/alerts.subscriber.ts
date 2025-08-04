import { domainEventBus } from './domain-event-bus';
import { HouseholdRepository } from '../persistence/repositories/household.repository';
import { ItemRepository } from '../persistence/repositories/item.repository';
import { NotificationPreferencesRepository } from '../persistence/repositories/notification-preferences.repository';
import { AlertRepository } from '../persistence/repositories/alert.repository';
import { UserRepository } from '../persistence/repositories/user.repository';
import { GetBudgetSummaryUseCase } from '../../application/use-cases/get-budget-summary.usecase';
import { AlertType } from '../../domain/models/enums/alert-type.enum';
import {
  ItemCreatedEvent,
  ItemUpdatedEvent,
  ItemDeletedEvent,
} from '../../domain/events/item.events';
import { BudgetGoalUpdatedEvent } from '../../domain/events/budget.events';
import { notifyHousehold } from '../websocket/socket.service';
import { EmailService } from '../notifications/email.service';

const householdRepo = new HouseholdRepository();
const itemRepo = new ItemRepository();
const prefsRepo = new NotificationPreferencesRepository();
const alertRepo = new AlertRepository();
const userRepo = new UserRepository();
const emailService = new EmailService();
const getSummary = new GetBudgetSummaryUseCase(householdRepo, itemRepo);

const checkBudgetAlerts = async (householdId: string) => {
  const household = await householdRepo.findById(householdId);
  if (!household) return;
  const summary = await getSummary.execute(householdId);
  if (!summary) return;
  const initialGoal = household.initialBudgetGoal?.amount;
  const monthlyGoal = household.monthlyBudgetGoal;
  const initialUsage =
    initialGoal && initialGoal > 0
      ? summary.initialTotal / initialGoal
      : undefined;
  const monthlyUsage =
    monthlyGoal && monthlyGoal > 0
      ? summary.monthlyTotal / monthlyGoal
      : undefined;
  const prefs = await prefsRepo.findByHousehold(householdId);
  for (const pref of prefs) {
    if (!pref.alerts?.budgetExceeded) continue;
    const threshold =
      pref.thresholds?.budgetUsage ??
      household.alertsConfig?.budgetUsageThreshold ??
      1;
    if (initialUsage !== undefined && initialUsage >= threshold) {
      const alert = await alertRepo.create({
        userId: pref.userId,
        householdId,
        type: AlertType.BUDGET_THRESHOLD,
        message: `Initial budget used ${(initialUsage * 100).toFixed(0)}%`,
        createdAt: new Date(),
        read: false,
      });
      notifyHousehold(householdId, 'alert:new', alert);
      if (pref.mediums.includes('email')) {
        const user = await userRepo.findById(pref.userId);
        if (user?.email) {
          await emailService.sendAlert(user.email, alert.message);
        }
      }
    }
    if (monthlyUsage !== undefined && monthlyUsage >= threshold) {
      const alert = await alertRepo.create({
        userId: pref.userId,
        householdId,
        type: AlertType.BUDGET_THRESHOLD,
        message: `Monthly budget used ${(monthlyUsage * 100).toFixed(0)}%`,
        createdAt: new Date(),
        read: false,
      });
      notifyHousehold(householdId, 'alert:new', alert);
      if (pref.mediums.includes('email')) {
        const user = await userRepo.findById(pref.userId);
        if (user?.email) {
          await emailService.sendAlert(user.email, alert.message);
        }
      }
    }
  }
};

domainEventBus.subscribe<ItemCreatedEvent>('ItemCreated', async (event) => {
  await checkBudgetAlerts(event.householdId);
});

domainEventBus.subscribe<ItemUpdatedEvent>('ItemUpdated', async (event) => {
  await checkBudgetAlerts(event.householdId);
});

domainEventBus.subscribe<ItemDeletedEvent>('ItemDeleted', async (event) => {
  await checkBudgetAlerts(event.householdId);
});

domainEventBus.subscribe<BudgetGoalUpdatedEvent>(
  'BudgetGoalUpdated',
  async (event) => {
    await checkBudgetAlerts(event.householdId);
  },
);
