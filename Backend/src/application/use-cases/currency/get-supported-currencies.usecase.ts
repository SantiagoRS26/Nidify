import { ExchangeRateProvider } from '../../../infrastructure/currency/exchange-rate.provider';

export class GetSupportedCurrenciesUseCase {
  constructor(private provider: ExchangeRateProvider) {}

  async execute(baseCurrency: string): Promise<string[]> {
    return this.provider.fetchSupportedCurrencies(baseCurrency);
  }
}
