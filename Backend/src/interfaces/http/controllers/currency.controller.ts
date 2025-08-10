import { Request, Response } from 'express';
import {
  ConvertCurrencyUseCase,
  ConvertCurrencyPayload,
} from '../../../application/use-cases/currency/convert-currency.usecase';
import { GetSupportedCurrenciesUseCase } from '../../../application/use-cases/currency/get-supported-currencies.usecase';
import {
  ConvertCurrencyRequestDto,
  SupportedCurrenciesRequestDto,
} from '../dto/currency.dto';

export class CurrencyController {
  constructor(
    private convertCurrency: ConvertCurrencyUseCase,
    private getSupportedCurrencies: GetSupportedCurrenciesUseCase,
  ) {}

  convert = async (req: Request, res: Response) => {
    const { from, to, amount } =
      req.query as unknown as ConvertCurrencyRequestDto;
    const payload: ConvertCurrencyPayload = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount,
    };
    const conversion = await this.convertCurrency.execute(payload);
    res.json({ conversion });
  };

  supported = async (req: Request, res: Response) => {
    const { base } = req.query as unknown as SupportedCurrenciesRequestDto;
    const currencies = await this.getSupportedCurrencies.execute(
      (base ?? 'USD').toUpperCase(),
    );
    res.json({ currencies });
  };
}
