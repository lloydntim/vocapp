import z from 'zod';

export const userProfileSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    username: z.string(),
    isVerified: z.boolean(),
    role: z.enum(['ADMIN', 'USER']),
    plan: z.enum(['FREE', 'PAID']),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .nullable();

export const updateProfileResponseSchema = z.object({
  message: z.string(),
  data: userProfileSchema,
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;

export const updateProfilePayloadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // email: z.string(), // TODO: implement once the re-verification flow exists.
});

export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>;
