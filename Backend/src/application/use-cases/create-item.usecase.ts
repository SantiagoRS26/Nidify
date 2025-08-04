import { Item } from '../../domain/models/item.model';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { ItemPriority } from '../../domain/models/enums/item-priority.enum';
import { ItemStatus } from '../../domain/models/enums/item-status.enum';
import { ItemType } from '../../domain/models/enums/item-type.enum';
import { PaymentSplit } from '../../domain/models/payment-split.model';
import { DomainEventBus } from '../../domain/events/domain-event-bus.interface';
import { ItemCreatedEvent } from '../../domain/events/item.events';

export interface CreateItemPayload {
  name: string;
  description?: string;
  categoryId?: string;
  type: ItemType;
  price: number;
  currency: string;
  purchaseLink?: string;
  imageUrls?: string[];
  status: ItemStatus;
  priority: ItemPriority;
  paymentSplit?: PaymentSplit;
  estimatedPurchaseDate?: Date;
  purchasedAt?: Date;
  tags?: string[];
  lastModifiedByName?: string;
  metadata?: Record<string, unknown>;
}

export class CreateItemUseCase {
  constructor(
    private itemRepo: ItemRepository,
    private eventBus: DomainEventBus,
  ) {}

  async execute(
    userId: string,
    householdId: string,
    payload: CreateItemPayload,
  ): Promise<Item> {
    const now = new Date();
    const item: Omit<Item, 'id'> = {
      householdId,
      ...payload,
      createdAt: now,
      updatedAt: now,
      lastModifiedBy: userId,
    };
    const created = await this.itemRepo.create(item);
    const event: ItemCreatedEvent = {
      type: 'ItemCreated',
      occurredOn: now,
      householdId,
      item: created,
      userId,
      ...(payload.lastModifiedByName
        ? { userName: payload.lastModifiedByName }
        : {}),
    };
    await this.eventBus.publish(event);
    return created;
  }
}
