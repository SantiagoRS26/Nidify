import { ItemPriority } from './item-priority.enum';
import { ItemStatus } from './item-status.enum';
import { ItemType } from './item-type.enum';
import { PaymentSplit } from './payment-split.model';

export interface Item {
  id: string;
  householdId: string;
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
  estimatedPurchaseDate?: string;
  purchasedAt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  lastModifiedByName?: string;
  metadata?: Record<string, unknown>;
}
