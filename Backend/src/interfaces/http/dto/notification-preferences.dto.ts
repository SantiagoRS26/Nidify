import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
  alerts: z
    .object({
      budgetExceeded: z.boolean().optional(),
      monthlyServiceReminder: z.boolean().optional(),
    })
    .optional(),
  mediums: z.array(z.string()).optional(),
  thresholds: z
    .object({
      budgetUsage: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type NotificationPreferencesDto = z.infer<
  typeof notificationPreferencesSchema
>;
