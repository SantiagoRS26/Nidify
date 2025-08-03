import { ItemPriority } from './enums/item-priority.enum';
import { ItemStatus } from './enums/item-status.enum';
import { ItemType } from './enums/item-type.enum';
import { PaymentSplit } from './payment-split.model';

/** Represents a purchasable or recurring item */
export interface Item {
  /** Unique identifier */
  id: string;
  /** Household owner */
  householdId: string;
  /** Item name */
  name: string;
  /** Optional description */
  description?: string;
  /** Category reference */
  categoryId?: string;
  /** One-time or recurring */
  type: ItemType;
  /** Base price */
  price: number;
  /** Currency ISO code */
  currency: string;
  /** Optional purchase link */
  purchaseLink?: string;
  /** Optional image URLs */
  imageUrls?: string[];
  /** Item status */
  status: ItemStatus;
  /** Priority for budgeting */
  priority: ItemPriority;
  /** Payment division among members */
  paymentSplit?: PaymentSplit;
  /** Estimated purchase date */
  estimatedPurchaseDate?: Date;
  /** Actual purchase date */
  purchasedAt?: Date;
  /** Free-form tags */
  tags?: string[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last edit timestamp */
  updatedAt: Date;
  /** User who made the last change */
  lastModifiedBy: string;
  /** Denormalized name of the modifier */
  lastModifiedByName?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}
