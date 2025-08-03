import { Schema, model, Document } from 'mongoose';
import { Item } from '../../../domain/models/item.model';
import { ItemType } from '../../../domain/models/enums/item-type.enum';
import { ItemStatus } from '../../../domain/models/enums/item-status.enum';
import { ItemPriority } from '../../../domain/models/enums/item-priority.enum';

interface ItemDocument extends Document, Omit<Item, 'id'> {}

const PaymentAssignmentSchema = new Schema({
  userId: { type: String, required: true },
  percentage: { type: Number },
  amount: { type: Number },
  calculatedAmount: { type: Number, required: true },
  label: { type: String },
});

const PaymentSplitSchema = new Schema({
  assignments: { type: [PaymentAssignmentSchema], default: [] },
});

const ItemSchema = new Schema<ItemDocument>({
  householdId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  categoryId: { type: String },
  type: { type: String, enum: Object.values(ItemType), required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  purchaseLink: { type: String },
  imageUrls: { type: [String], default: [] },
  status: {
    type: String,
    enum: Object.values(ItemStatus),
    default: ItemStatus.TO_QUOTE,
  },
  priority: {
    type: String,
    enum: Object.values(ItemPriority),
    default: ItemPriority.NECESSARY,
  },
  paymentSplit: { type: PaymentSplitSchema },
  estimatedPurchaseDate: { type: Date },
  purchasedAt: { type: Date },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastModifiedBy: { type: String, required: true },
  lastModifiedByName: { type: String },
  metadata: { type: Schema.Types.Mixed },
});

ItemSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const ItemModel = model<ItemDocument>('Item', ItemSchema);
