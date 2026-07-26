import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(1, 'Username is required.')
  .min(3, 'Username must be at least 3 characters.')
  .max(30, 'Username must be at most 30 characters.');

const emailSchema = z
  .email('Enter a valid email address.')
  .min(1, 'Email is required.');

const passwordSchema = z
  .string()
  .min(1, 'Password is required.')
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[a-zA-Z]/, 'Password must include a letter.')
  .regex(/\d/, 'Password must include a number.');

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must be at most 50 characters.'),
  lastName: z
    .string()
    .min(1, 'Last name is required.')
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must be at most 50 characters.'),
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  terms: z.literal(true, {
    error: 'You must accept the terms and privacy policy.',
  }),
});

const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const verifyResponseSchema = z.object({
  message: z.string(),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema };
export type {
  LoginFormValues,
  SignupFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
};

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  username: z.string(),
  isVerified: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  role: z.enum(['ADMIN', 'USER']),
  plan: z.enum(['PAID', 'FREE']),
});

export const loginResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const signupResponseSchema = z.object({
  message: z.string(),
  data: userSchema,
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});
