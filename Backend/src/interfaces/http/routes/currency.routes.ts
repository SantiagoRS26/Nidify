import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { ExchangeRateRepository } from '../../../infrastructure/persistence/repositories/exchange-rate.repository';
import { ExchangeRateProvider } from '../../../infrastructure/currency/exchange-rate.provider';
import { ConvertCurrencyUseCase } from '../../../application/use-cases/convert-currency.usecase';
import { validate } from '../../middleware/validation.middleware';
import {
  convertCurrencySchema,
  supportedCurrenciesSchema,
} from '../dto/currency.dto';
import { GetSupportedCurrenciesUseCase } from '../../../application/use-cases/get-supported-currencies.usecase';

const router = Router();

const repo = new ExchangeRateRepository();
const provider = new ExchangeRateProvider();
const convertUseCase = new ConvertCurrencyUseCase(repo, provider);
const supportedUseCase = new GetSupportedCurrenciesUseCase(provider);
const controller = new CurrencyController(convertUseCase, supportedUseCase);

router.get(
  '/convert',
  validate({ query: convertCurrencySchema }),
  controller.convert,
);

router.get(
  '/supported',
  validate({ query: supportedCurrenciesSchema }),
  controller.supported,
);

export default router;
