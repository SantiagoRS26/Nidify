import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().optional(),
  isBase: z.boolean().optional(),
});

export type CreateCategoryRequestDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryRequestDto = z.infer<typeof updateCategorySchema>;
