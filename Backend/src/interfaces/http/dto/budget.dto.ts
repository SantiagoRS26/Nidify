import { z } from 'zod';

export const updateBudgetSchema = z.object({
  amount: z.number().nonnegative(),
  targetDate: z.coerce.date().optional(),
  reason: z.string().max(255).optional(),
});

export type UpdateBudgetRequestDto = z.infer<typeof updateBudgetSchema>;
