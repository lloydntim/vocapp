import type { Request, Response } from 'express';
import type User from '../../shared/types/user.types.js';
import type { UserInput } from '../users/user.types.js';

import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';

import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
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

type UserResponseData = Omit<User, 'password'>;

type AuthRequest<P = NoParams, ResBody = AuthResponse, ReqBody = unknown> = Omit<
  Request<P, ResBody, ReqBody>,
  'cookies'
> & { cookies: AuthCookies };

interface AuthResponse {
  accessToken?: string;
  data?: UserResponseData;
  message?: string;
}

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth', // Only sent to auth routes
} as const;

async function register(
  req: Request<NoParams, AuthResponse, UserInput>,
  res: Response<AuthResponse>,
) {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    logger.warn('Form data is invalid');

    throw new BadRequestError('Form fields are incomplete');
  }

  const { userData } = await registerUser(req.body);

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

  if (!username || !password) {
    logger.warn('Form data is invalid');

    throw new BadRequestError('Form fields are incomplete');
  }

  const { accessToken, refreshToken, userData } = await loginUser({
    username,
    password,
  });

  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json({
    message: 'User is logged in',
    data: userData,
    accessToken,
  });
}

function logout(req: AuthRequest, res: Response) {
  const { refreshToken } = req.cookies;

  logoutUser(refreshToken);

  res.cookie('refreshToken', '');

  return res.status(200).json({
    message: 'Logged out successfully',
  });
}

function forgotPassword(
  req: Request<NoParams, AuthResponse, ForgotPasswordInput>,
  res: Response<AuthResponse>,
) {
  const { email } = req.body;

  if (!email) {
    logger.warn('Form data is invalid');

    throw new BadRequestError('Form fields are incomplete');
  }

  const { rawResetToken: resetToken } = requestPasswordReset({ email });

  res.status(200).json({
    message: `https://www.vocapp.com/res-et?token=${resetToken}`, // message: 'Reset link sent to user',
  });
}

async function resetPassword(
  req: Request<{ token: string }, AuthResponse, UserInput>,
  res: Response<AuthResponse>,
) {
  // get temporary token
  const { token } = req.params;

  if (!token) {
    throw new UnauthorizedError('Token not valid or expired');
  }

  const { password } = req.body;

  if (!password) {
    throw new BadRequestError('Form fields are incomplete');
  }

  const user = await resetUserPassword({ token, password });

  res.cookie('refreshToken', '');

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

  // return access token
  res.status(200).json({ accessToken: newAccessToken });
}

async function verify(req: AuthRequest<NoParams, AuthResponse>, res: Response<AuthResponse>) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError('No refresh token', 'NO_REFRESH_TOKEN');
  }

  const { newAccessToken, newRefreshToken } = await verifyUser(refreshToken);

  // set cookie with new refresh token
  res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // return access token
  res.status(200).json({ accessToken: newAccessToken, message: 'User has been verified' });
}

export default { register, login, logout, forgotPassword, resetPassword, refresh, verify };
