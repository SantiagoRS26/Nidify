import { z } from 'zod';

export const currencyPreferenceSchema = z.object({
  currency: z.string().length(3),
});

export type CurrencyPreferenceDto = z.infer<typeof currencyPreferenceSchema>;
