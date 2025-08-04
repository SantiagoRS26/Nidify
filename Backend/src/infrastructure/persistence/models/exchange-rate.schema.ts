import { Schema, model, Document } from 'mongoose';
import { ExchangeRate } from '../../../domain/models/exchange-rate.model';

interface ExchangeRateDocument extends Document, Omit<ExchangeRate, 'id'> {}

const ExchangeRateSchema = new Schema<ExchangeRateDocument>({
  baseCurrency: { type: String, required: true },
  targetCurrency: { type: String, required: true },
  rate: { type: Number, required: true },
  fetchedAt: { type: Date, required: true },
  source: { type: String, required: true },
  expiresAt: { type: Date },
});

ExchangeRateSchema.index(
  { baseCurrency: 1, targetCurrency: 1 },
  { unique: true },
);

export const ExchangeRateModel = model<ExchangeRateDocument>(
  'ExchangeRate',
  ExchangeRateSchema,
);
