import { ExchangeRate } from '../../../domain/models/exchange-rate.model';
import { ExchangeRateModel } from '../models/exchange-rate.schema';

export class ExchangeRateRepository {
  async find(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate | null> {
    return (await ExchangeRateModel.findOne({
      baseCurrency,
      targetCurrency,
    }).lean()) as ExchangeRate | null;
  }

  async save(rate: ExchangeRate): Promise<ExchangeRate> {
    await ExchangeRateModel.findOneAndUpdate(
      {
        baseCurrency: rate.baseCurrency,
        targetCurrency: rate.targetCurrency,
      },
      rate,
      { upsert: true },
    );
    return rate;
  }
}
