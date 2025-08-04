import { config } from '../../config/env';

interface FetchRateResult {
  rate: number;
  source: string;
}

export class ExchangeRateProvider {
  constructor(private apiBase = config.exchangeRateApiBase) {}

  async fetchRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<FetchRateResult> {
    const url = `${this.apiBase}/latest?base=${baseCurrency}&symbols=${targetCurrency}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    const data = (await response.json()) as {
      rates?: Record<string, number>;
    };
    const rate = data.rates?.[targetCurrency];
    if (typeof rate !== 'number') {
      throw new Error('Invalid exchange rate data');
    }
    return { rate, source: this.apiBase };
  }
}
