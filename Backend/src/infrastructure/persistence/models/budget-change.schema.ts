import { Schema, model, Document } from 'mongoose';
import { BudgetChange } from '../../../domain/models/budget-change.model';

interface BudgetChangeDocument extends Document, Omit<BudgetChange, 'id'> {}

const BudgetChangeSchema = new Schema<BudgetChangeDocument>({
  householdId: { type: String, required: true },
  type: { type: String, required: true },
  previousAmount: { type: Number, required: true },
  newAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String },
});

export const BudgetChangeModel = model<BudgetChangeDocument>(
  'BudgetChange',
  BudgetChangeSchema,
);
