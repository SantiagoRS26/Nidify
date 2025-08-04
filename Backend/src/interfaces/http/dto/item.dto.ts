import { z } from 'zod';
import { ItemPriority } from '../../../domain/models/enums/item-priority.enum';
import { ItemStatus } from '../../../domain/models/enums/item-status.enum';
import { ItemType } from '../../../domain/models/enums/item-type.enum';
import { PaymentSplit } from '../../../domain/models/payment-split.model';

export const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.nativeEnum(ItemType),
  price: z.number().nonnegative(),
  currency: z.string().min(1),
  purchaseLink: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  status: z.nativeEnum(ItemStatus),
  priority: z.nativeEnum(ItemPriority),
  paymentSplit: z.custom<PaymentSplit>().optional(),
  estimatedPurchaseDate: z.coerce.date().optional(),
  purchasedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  lastModifiedByName: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateItemRequestDto = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();
export type UpdateItemRequestDto = z.infer<typeof updateItemSchema>;
