import { z } from 'zod';

export const convertCurrencySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
});

export type ConvertCurrencyRequestDto = z.infer<typeof convertCurrencySchema>;
