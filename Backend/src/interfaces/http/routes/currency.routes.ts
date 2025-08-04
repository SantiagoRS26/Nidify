import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { ExchangeRateRepository } from '../../../infrastructure/persistence/repositories/exchange-rate.repository';
import { ExchangeRateProvider } from '../../../infrastructure/currency/exchange-rate.provider';
import { ConvertCurrencyUseCase } from '../../../application/use-cases/convert-currency.usecase';
import { validate } from '../../middleware/validation.middleware';
import { convertCurrencySchema } from '../dto/currency.dto';

const router = Router();

const repo = new ExchangeRateRepository();
const provider = new ExchangeRateProvider();
const useCase = new ConvertCurrencyUseCase(repo, provider);
const controller = new CurrencyController(useCase);

router.get(
  '/convert',
  validate({ query: convertCurrencySchema }),
  controller.convert,
);

export default router;
