import { config } from '../../config/env';
import { ExternalServiceError } from '../../domain/errors/external-service.error';

interface FetchRateResult {
  rate: number;
  source: string;
}

interface CachedRates {
  rates: Record<string, number>;
  expiresAt: number;
}

export class ExchangeRateProvider {
  private cache: Record<string, CachedRates> = {};

  constructor(private apiBase = config.exchangeRateApiBase) {}

  private ttlMs = config.exchangeRateTtlMinutes * 60 * 1000;

  private async getRates(
    baseCurrency: string,
  ): Promise<Record<string, number>> {
    const base = baseCurrency.toUpperCase();
    const cached = this.cache[base];
    if (cached && cached.expiresAt > Date.now()) {
      return cached.rates;
    }
    const url = `${this.apiBase}/${base}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new ExternalServiceError('Failed to fetch exchange rates');
    }
    const data = (await response.json()) as { rates?: Record<string, number> };
    if (!data.rates) {
      throw new ExternalServiceError('Invalid exchange rate data');
    }
    this.cache[base] = {
      rates: data.rates,
      expiresAt: Date.now() + this.ttlMs,
    };
    return data.rates;
  }

  async fetchRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<FetchRateResult> {
    const rates = await this.getRates(baseCurrency);
    const rate = rates[targetCurrency.toUpperCase()];
    if (typeof rate !== 'number') {
      throw new ExternalServiceError('Invalid exchange rate data');
    }
    return { rate, source: this.apiBase };
  }

  async fetchSupportedCurrencies(baseCurrency: string): Promise<string[]> {
    const rates = await this.getRates(baseCurrency);
    return Object.keys(rates);
  }
}
