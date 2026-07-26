import z from 'zod';
import {
  loginResponseSchema,
  logoutResponseSchema,
  signupResponseSchema,
  userSchema,
  verifyResponseSchema,
} from './schemas';

export type User = z.infer<typeof userSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type VerifyResponse = z.infer<typeof verifyResponseSchema>;
