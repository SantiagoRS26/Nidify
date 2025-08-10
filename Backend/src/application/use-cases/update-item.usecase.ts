import { Item } from '../../domain/models/item.model';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { CategoryRepository } from '../../infrastructure/persistence/repositories/category.repository';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { ItemPriority } from '../../domain/models/enums/item-priority.enum';
import { ItemStatus } from '../../domain/models/enums/item-status.enum';
import { ItemType } from '../../domain/models/enums/item-type.enum';
import { PaymentSplit } from '../../domain/models/payment-split.model';
import { calculatePaymentSplit } from '../../domain/services/payment-split.service';
import { DomainEventBus } from '../../domain/events/domain-event-bus.interface';
import { ItemUpdatedEvent } from '../../domain/events/item.events';

export interface UpdateItemPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  type?: ItemType;
  price?: number;
  currency?: string;
  purchaseLink?: string;
  imageUrls?: string[];
  status?: ItemStatus;
  priority?: ItemPriority;
  paymentSplit?: PaymentSplit;
  estimatedPurchaseDate?: Date;
  purchasedAt?: Date;
  tags?: string[];
  lastModifiedByName?: string;
  metadata?: Record<string, unknown>;
}

export class UpdateItemUseCase {
  constructor(
    private itemRepo: ItemRepository,
    private categoryRepo: CategoryRepository,
    private eventBus: DomainEventBus,
  ) {}

  async execute(
    userId: string,
    itemId: string,
    payload: UpdateItemPayload,
  ): Promise<Item | null> {
    const before = await this.itemRepo.findById(itemId);
    if (!before) return null;
    const price = payload.price ?? before.price;
    const split = payload.paymentSplit ?? before.paymentSplit;
    if (payload.categoryId) {
      const category = await this.categoryRepo.findById(payload.categoryId);
      if (!category || category.householdId !== before.householdId) {
        throw new NotFoundError('Category not found');
      }
    }
    const update: Partial<Item> = {
      ...payload,
      ...(split ? { paymentSplit: calculatePaymentSplit(price, split) } : {}),
      lastModifiedBy: userId,
      updatedAt: new Date(),
    };
    const updated = await this.itemRepo.update(itemId, update);
    if (updated) {
      const event: ItemUpdatedEvent = {
        type: 'ItemUpdated',
        occurredOn: update.updatedAt as Date,
        householdId: updated.householdId,
        before,
        after: updated,
        userId,
        ...(payload.lastModifiedByName
          ? { userName: payload.lastModifiedByName }
          : {}),
      };
      await this.eventBus.publish(event);
    }
    return updated;
  }
}
