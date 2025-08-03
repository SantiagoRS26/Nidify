import { ItemPriority } from '../../../domain/models/enums/item-priority.enum';
import { ItemStatus } from '../../../domain/models/enums/item-status.enum';
import { ItemType } from '../../../domain/models/enums/item-type.enum';
import { PaymentSplit } from '../../../domain/models/payment-split.model';

export interface CreateItemRequestDto {
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

export type UpdateItemRequestDto = Partial<CreateItemRequestDto>;
