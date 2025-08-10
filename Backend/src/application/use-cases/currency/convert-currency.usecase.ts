import { ExchangeRate } from '../../../domain/models/exchange-rate.model';
import { ExchangeRateRepository } from '../../../infrastructure/persistence/repositories/exchange-rate.repository';
import { ExchangeRateProvider } from '../../../infrastructure/currency/exchange-rate.provider';
import { config } from '../../../config/env';

export interface ConvertCurrencyPayload {
  amount: number;
  from: string;
  to: string;
}

export interface ConversionResult {
  amount: number;
  convertedAmount: number;
  rate: number;
  baseCurrency: string;
  targetCurrency: string;
  fetchedAt: Date;
  source: string;
}

export class ConvertCurrencyUseCase {
  constructor(
    private repo: ExchangeRateRepository,
    private provider: ExchangeRateProvider,
  ) {}

  private ttlMs = config.exchangeRateTtlMinutes * 60 * 1000;

  async execute(payload: ConvertCurrencyPayload): Promise<ConversionResult> {
    const { amount, from, to } = payload;
    const now = new Date();
    let rate: ExchangeRate | null = await this.repo.find(from, to);
    if (!rate || (rate.expiresAt && rate.expiresAt <= now)) {
      const fetched = await this.provider.fetchRate(from, to);
      rate = {
        id: `${from}_${to}`,
        baseCurrency: from,
        targetCurrency: to,
        rate: fetched.rate,
        fetchedAt: new Date(),
        source: fetched.source,
        expiresAt: new Date(Date.now() + this.ttlMs),
      };
      await this.repo.save(rate);
    }
    const convertedAmount = amount * rate.rate;
    return {
      amount,
      convertedAmount,
      rate: rate.rate,
      baseCurrency: rate.baseCurrency,
      targetCurrency: rate.targetCurrency,
      fetchedAt: rate.fetchedAt,
      source: rate.source,
    };
  }
}
