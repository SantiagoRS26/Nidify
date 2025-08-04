import { Item } from '../../domain/models/item.model';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { DomainEventBus } from '../../domain/events/domain-event-bus.interface';
import { ItemDeletedEvent } from '../../domain/events/item.events';

export class DeleteItemUseCase {
  constructor(
    private itemRepo: ItemRepository,
    private eventBus: DomainEventBus,
  ) {}

  async execute(
    userId: string,
    itemId: string,
    userName?: string,
  ): Promise<Item | null> {
    const item = await this.itemRepo.findById(itemId);
    if (!item) return null;
    await this.itemRepo.delete(itemId);
    const event: ItemDeletedEvent = {
      type: 'ItemDeleted',
      occurredOn: new Date(),
      householdId: item.householdId,
      item,
      userId,
      ...(userName ? { userName } : {}),
    };
    await this.eventBus.publish(event);
    return item;
  }
}
