import z from 'zod';

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(128),
  }),
});

export const verifyUserSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens and underscores'),
    password: z.string().min(8).max(128),
  }),
});
