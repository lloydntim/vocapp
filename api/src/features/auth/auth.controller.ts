import type { Request, Response } from 'express';
import type { User } from '../../generated/prisma/client.js';
import type { CreateUserInput } from '../users/user.schema.js';

import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';

import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import emailService from '../../shared/email/email.factory.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  rotateRefreshToken,
  verifyUser,
} from './auth.service.js';
import { type ForgotPasswordInput, type LoginInput } from './auth.types.js';

type NoParams = Record<string, never>;

interface AuthCookies {
  refreshToken: string;
}

type UserResponseData = User;

type AuthRequest<P = NoParams, ResBody = AuthResponse, ReqBody = unknown> = Omit<
  Request<P, ResBody, ReqBody>,
  'cookies'
> & { cookies: AuthCookies };

interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  data?: UserResponseData;
  message?: string;
}

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth',
};

const REFRESH_TOKEN_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
  path: '/api/v1/auth',
};

async function register(
  req: Request<NoParams, AuthResponse, CreateUserInput>,
  res: Response<AuthResponse>,
) {
  const { locale, ...userEntries } = req.body;
  const { verificationToken, userData } = await registerUser(userEntries);
  const verificationUrl = `${env.CLIENT_URL}/${locale}/verify/confirm?token=${verificationToken}`;

  emailService.sendVerificationEmail({
    to: userData.email,
    verificationUrl,
  });

  res.status(201).json({
    message: 'User was created',
    data: userData,
  });
}

async function login(
  req: AuthRequest<NoParams, AuthResponse, LoginInput>,
  res: Response<AuthResponse>,
) {
  const { username, password } = req.body;

  const { accessToken, refreshToken, userData } = await loginUser({
    username,
    password,
  });

  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json({
    message: 'User is logged in',
    data: userData,
    accessToken,
    refreshToken,
  });
}

async function logout(req: AuthRequest, res: Response) {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie('refreshToken', REFRESH_TOKEN_CLEAR_OPTIONS);

  return res.status(200).json({
    message: 'Logged out successfully',
  });
}

async function forgotPassword(
  req: Request<NoParams, AuthResponse, ForgotPasswordInput>,
  res: Response<AuthResponse>,
) {
  const { email } = req.body;

  if (!email) {
    logger.warn('Form data is invalid');

    throw new BadRequestError('Form fields are incomplete');
  }

  const { rawResetToken: resetToken } = await requestPasswordReset({ email });

  const resetUrl = `${env.CLIENT_URL}/reset?token=${resetToken}`;

  emailService.sendResetPasswordEmail({
    to: email,
    resetUrl,
  });

  logger.info('Password reset process has been started');

  res.status(200).json({
    message: 'Password reset process has been started', // message: 'Reset link sent to user',
  });
}

async function resetPassword(
  req: Request<NoParams, AuthResponse, CreateUserInput & { token: string }>,
  res: Response<AuthResponse>,
) {
  const { token, password } = req.body;

  if (!password) {
    throw new BadRequestError('Form fields are incomplete');
  }

  const user = await resetUserPassword({ token, password });

  res.clearCookie('refreshToken', REFRESH_TOKEN_CLEAR_OPTIONS);

  logger.info({ userId: user.id }, `Password for user has been updated.`);
  res.status(200).json({
    message: 'Password updated successfully',
  });
}

async function refresh(req: AuthRequest<NoParams, AuthResponse>, res: Response<AuthResponse>) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError('No refresh token', 'NO_REFRESH_TOKEN');
  }

  const { newAccessToken, newRefreshToken } = await rotateRefreshToken(refreshToken);

  // set cookie with new refresh token
  res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}

async function verify(req: Request, res: Response<AuthResponse>) {
  const { token } = req.body;

  if (!token) {
    throw new UnauthorizedError('Verify Token invalid or expired');
  }

  const { newAccessToken, newRefreshToken, userId } = await verifyUser(token);

  res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  logger.info({ userId }, 'User has been verified');

  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    message: 'User has been verified',
  });
}

export default { register, login, logout, forgotPassword, resetPassword, refresh, verify };
