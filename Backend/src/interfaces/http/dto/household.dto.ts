import { z } from 'zod';

export const createHouseholdSchema = z.object({
  name: z.string().min(1),
  baseCurrency: z.string().min(1),
});
export type CreateHouseholdRequestDto = z.infer<typeof createHouseholdSchema>;

export const inviteSchema = z.object({
  email: z.string().email(),
});
export type InviteRequestDto = z.infer<typeof inviteSchema>;

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
});
export type AcceptInvitationRequestDto = z.infer<typeof acceptInvitationSchema>;
