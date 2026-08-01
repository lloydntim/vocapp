import { clientApi } from '@/lib/client-api';
import {
  loginSchema,
  loginResponseSchema,
  SignupFormValues,
  signupSchema,
  signupResponseSchema,
  logoutResponseSchema,
  verifyResponseSchema,
  LoginFormValues,
  ForgotPasswordFormValues,
  forgotPasswordSchema,
  forgotPasswordResponseSchema,
  resetPasswordResponseSchema,
} from '@/features/auth/schemas';

import {
  ForgotPasswordResponse,
  LoginResponse,
  ResetPasswordResponse,
  SignupResponse,
  User,
  VerifyResponse,
} from '../types';

export async function login(data: LoginFormValues): Promise<LoginResponse> {
  const credentials = loginSchema.parse(data);

  const response = await clientApi<unknown>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return loginResponseSchema.parse(response);
}

export async function signup(
  payload: SignupFormValues & { locale: string },
): Promise<SignupResponse> {
  const { locale, ...data } = payload;
  const userDetails = signupSchema.parse(data);
  const { terms: _, ...registrationData } = userDetails;

  const response = await clientApi<unknown>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ ...registrationData, locale }),
  });
  return signupResponseSchema.parse(response);
}

export async function verify(payload: {
  token: string;
}): Promise<VerifyResponse> {
  const { token } = payload;

  const response = await clientApi<unknown>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return verifyResponseSchema.parse(response);
}

export async function requestPasswordReset(
  data: ForgotPasswordFormValues,
): Promise<ForgotPasswordResponse> {
  const { email } = forgotPasswordSchema.parse(data);

  const response = await clientApi<unknown>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return forgotPasswordResponseSchema.parse(response);
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}): Promise<ResetPasswordResponse> {
  const response = await clientApi<unknown>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return resetPasswordResponseSchema.parse(response);
}

export async function logout(): Promise<void> {
  const response = await clientApi<unknown>('/auth/logout', {
    method: 'POST',
  });
  logoutResponseSchema.parse(response);
}

export async function getCurrentUser() {
  return clientApi<{ data: User }>('/users/me');
}
