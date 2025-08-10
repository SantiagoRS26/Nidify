import { z } from 'zod';

export const convertCurrencySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
});

export type ConvertCurrencyRequestDto = z.infer<typeof convertCurrencySchema>;

export const supportedCurrenciesSchema = z.object({
  base: z.string().length(3).optional(),
});

export type SupportedCurrenciesRequestDto = z.infer<
  typeof supportedCurrenciesSchema
>;
