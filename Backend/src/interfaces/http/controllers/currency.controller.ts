import { Request, Response } from 'express';
import {
  ConvertCurrencyUseCase,
  ConvertCurrencyPayload,
} from '../../../application/use-cases/convert-currency.usecase';

export class CurrencyController {
  constructor(private convertCurrency: ConvertCurrencyUseCase) {}

  convert = async (req: Request, res: Response) => {
    const { from, to, amount } = req.query as unknown as {
      from: string;
      to: string;
      amount: string;
    };
    const payload: ConvertCurrencyPayload = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: Number(amount),
    };
    const conversion = await this.convertCurrency.execute(payload);
    res.json({ conversion });
  };
}
