import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  preferredCurrency: z.string().length(3).optional(),
});
export type RegisterRequestDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequestDto = z.infer<typeof loginSchema>;

export const googleSchema = z.object({
  idToken: z.string().min(1),
});
export type GoogleRequestDto = z.infer<typeof googleSchema>;
