import { Router } from 'express';
import { UserPreferencesController } from '../controllers/user-preferences.controller';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { UpdatePreferredCurrencyUseCase } from '../../../application/use-cases/currency/update-preferred-currency.usecase';
import { authMiddleware } from '../../middleware/auth.middleware';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { validate } from '../../middleware/validation.middleware';
import { currencyPreferenceSchema } from '../dto/currency-preference.dto';

const router = Router();
const userRepository = new UserRepository();
const updatePreferredCurrency = new UpdatePreferredCurrencyUseCase(
  userRepository,
);
const jwtService = new JwtService();
const controller = new UserPreferencesController(updatePreferredCurrency);

router.patch(
  '/me/currency',
  authMiddleware(jwtService),
  validate({ body: currencyPreferenceSchema }),
  controller.updateCurrency,
);

export default router;
