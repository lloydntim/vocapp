import z from 'zod';
import {
  forgotPasswordResponseSchema,
  loginResponseSchema,
  logoutResponseSchema,
  resetPasswordResponseSchema,
  signupResponseSchema,
  userSchema,
  verifyResponseSchema,
} from './schemas';

export type User = z.infer<typeof userSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type VerifyResponse = z.infer<typeof verifyResponseSchema>;
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
