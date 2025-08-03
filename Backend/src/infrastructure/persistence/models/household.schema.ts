import { Schema, model, Document } from 'mongoose';
import {
  Household,
  BudgetGoal,
  HouseholdAlertsConfig,
} from '../../../domain/models/household.model';

interface HouseholdDocument extends Document, Omit<Household, 'id'> {}

const BudgetGoalSchema = new Schema<BudgetGoal>({
  amount: { type: Number, required: true },
  targetDate: { type: Date },
});

const AlertsConfigSchema = new Schema<HouseholdAlertsConfig>({
  budgetUsageThreshold: { type: Number },
});

const HouseholdSchema = new Schema<HouseholdDocument>({
  name: { type: String, required: true },
  baseCurrency: { type: String, required: true },
  initialBudgetGoal: { type: BudgetGoalSchema },
  monthlyBudgetGoal: { type: Number },
  alertsConfig: { type: AlertsConfigSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HouseholdSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const HouseholdModel = model<HouseholdDocument>(
  'Household',
  HouseholdSchema,
);
