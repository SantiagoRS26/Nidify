import { domainEventBus } from './domain-event-bus';
import { ChangelogRepository } from '../persistence/repositories/changelog.repository';
import { ChangelogEntityType } from '../../domain/models/enums/changelog-entity-type.enum';
import { ChangelogChangeType } from '../../domain/models/enums/changelog-change-type.enum';
import {
  ItemCreatedEvent,
  ItemUpdatedEvent,
  ItemDeletedEvent,
} from '../../domain/events/item.events';
import { BudgetGoalUpdatedEvent } from '../../domain/events/budget.events';

const repo = new ChangelogRepository();

domainEventBus.subscribe<ItemCreatedEvent>('ItemCreated', async (event) => {
  await repo.create({
    householdId: event.householdId,
    entityType: ChangelogEntityType.ITEM,
    entityId: event.item.id,
    changeType: ChangelogChangeType.CREATE,
    description: `Item ${event.item.name} created`,
    diff: { after: event.item },
    userId: event.userId,
    userName: event.userName ?? '',
    timestamp: event.occurredOn,
  });
});

domainEventBus.subscribe<ItemUpdatedEvent>('ItemUpdated', async (event) => {
  await repo.create({
    householdId: event.householdId,
    entityType: ChangelogEntityType.ITEM,
    entityId: event.after.id,
    changeType: ChangelogChangeType.UPDATE,
    description: `Item ${event.after.name} updated`,
    diff: { before: event.before, after: event.after },
    userId: event.userId,
    userName: event.userName ?? '',
    timestamp: event.occurredOn,
  });
});

domainEventBus.subscribe<ItemDeletedEvent>('ItemDeleted', async (event) => {
  await repo.create({
    householdId: event.householdId,
    entityType: ChangelogEntityType.ITEM,
    entityId: event.item.id,
    changeType: ChangelogChangeType.DELETE,
    description: `Item ${event.item.name} deleted`,
    diff: { before: event.item },
    userId: event.userId,
    userName: event.userName ?? '',
    timestamp: event.occurredOn,
  });
});

domainEventBus.subscribe<BudgetGoalUpdatedEvent>(
  'BudgetGoalUpdated',
  async (event) => {
    await repo.create({
      householdId: event.householdId,
      entityType: ChangelogEntityType.BUDGET,
      entityId: event.householdId,
      changeType: ChangelogChangeType.UPDATE,
      description: `Budget goal ${event.goalType} updated`,
      diff: {
        previousAmount: event.previousAmount,
        newAmount: event.newAmount,
        type: event.goalType,
      },
      userId: event.userId,
      userName: event.userName ?? '',
      timestamp: event.occurredOn,
    });
  },
);
