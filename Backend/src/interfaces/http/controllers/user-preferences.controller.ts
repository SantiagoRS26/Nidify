import { Request, Response } from 'express';
import { UpdatePreferredCurrencyUseCase } from '../../../application/use-cases/update-preferred-currency.usecase';
import { CurrencyPreferenceDto } from '../dto/currency-preference.dto';
import { toPublicUser } from '../dto/user.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class UserPreferencesController {
  constructor(
    private updatePreferredCurrency: UpdatePreferredCurrencyUseCase,
  ) {}

  updateCurrency = async (req: Request, res: Response) => {
    const { currency } = req.body as CurrencyPreferenceDto;
    const user = await this.updatePreferredCurrency.execute(
      (req as AuthRequest).userId,
      currency,
    );
    res.json({ user: toPublicUser(user) });
  };
}
