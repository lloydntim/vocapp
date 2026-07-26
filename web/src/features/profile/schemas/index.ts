import z from 'zod';

import { userSchema as profileSchema } from '@/features/auth/schemas';

export const updateProfileResponseSchema = z.object({
  message: z.string(),
  data: profileSchema,
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;

export const updateProfilePayloadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // email: z.string(), // TODO: implement once the re-verification flow exists.
});

export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>;
