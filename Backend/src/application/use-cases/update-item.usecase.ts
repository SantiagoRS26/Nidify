import { Item } from '../../domain/models/item.model';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { ItemPriority } from '../../domain/models/enums/item-priority.enum';
import { ItemStatus } from '../../domain/models/enums/item-status.enum';
import { ItemType } from '../../domain/models/enums/item-type.enum';
import { PaymentSplit } from '../../domain/models/payment-split.model';

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
  constructor(private itemRepo: ItemRepository) {}

  async execute(
    userId: string,
    itemId: string,
    payload: UpdateItemPayload,
  ): Promise<Item | null> {
    const update: Partial<Item> = {
      ...payload,
      lastModifiedBy: userId,
      updatedAt: new Date(),
    };
    return this.itemRepo.update(itemId, update);
  }
}
