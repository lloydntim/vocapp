import { clientApi } from '@/lib/client-api';
import {
  type LoginFormValues,
  type LoginResponse,
  loginSchema,
  loginResponseSchema,
  SignupFormValues,
  SignupResponse,
  signupSchema,
  signupResponseSchema,
  logoutResponseSchema,
} from '@/features/auth/schemas';

export async function login(data: LoginFormValues): Promise<LoginResponse> {
  const credentials = loginSchema.parse(data);

  const response = await clientApi<unknown>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return loginResponseSchema.parse(response);
}

export async function signup(data: SignupFormValues): Promise<SignupResponse> {
  const userDetails = signupSchema.parse(data);
  const { terms: _, ...registrationData } = userDetails;

  const response = await clientApi<unknown>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  });
  return signupResponseSchema.parse(response);
}

export async function logout(): Promise<void> {
  const response = await clientApi<unknown>('/auth/logout', {
    method: 'POST',
  });
  logoutResponseSchema.parse(response);
}
