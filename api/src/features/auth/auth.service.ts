import { hash, verify } from 'argon2';
import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { ConflictError } from '../../errors/ConflictError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import { TokenPurpose } from '../../generated/prisma/enums.js';
import redisClient from '../../redis/client.js';
import type { CreateUserInput as RegisterInput } from '../users/user.schema.js';
import userRepository from './../users/user.repository.js';
import { type ForgotPasswordInput, type LoginInput } from './auth.types.js';
import refreshTokenRepository from './refreshToken.repository.js';
import tokenRepository from './token.repository.js';
import tokenService from './token.service.js';

const REFRESH_TOKEN_REUSE_GRACE_SECONDS = 30;

export async function registerUser(input: RegisterInput) {
  const { password, ...userData } = input;
  const { username, email } = userData;
  const hashedPassword = await hash(password);

  const existingUser = await userRepository.findConflictingUser(username, email);

  if (existingUser) {
    logger.warn({ username, email }, 'Username or email exists already');
    throw new ConflictError('Username or email exists already');
  }

  const newUser = await userRepository.addUser(userData, hashedPassword);

  const rawVerifyUserToken = tokenService.generateRandomToken();
  const hashedVerifyToken = tokenService.hashRandomToken(rawVerifyUserToken);

  tokenRepository.upsertToken({
    userId: newUser.id,
    tokenHash: hashedVerifyToken,
    purpose: TokenPurpose.VERIFY_ACCOUNT,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  logger.info({ userId: newUser.id }, 'User was created');

  return {
    userData: newUser,
    verificationToken: rawVerifyUserToken,
  };
}

export async function loginUser({ username, password }: LoginInput) {
  const existingUser = await userRepository.findUserByLoginIdentifier(username);

  if (!existingUser?.credential?.passwordHash) {
    logger.warn({ username }, 'Invalid login attempt');
    throw new UnauthorizedError('Wrong username or password, please try again');
  }

  const matched = await verify(existingUser.credential?.passwordHash, password);

  if (!matched) {
    logger.warn({ username }, 'Invalid login attempt');
    throw new UnauthorizedError('Wrong username or password, please try again');
  }

  const accessToken = tokenService.generateAccessToken(existingUser);
  const rawRefreshToken = tokenService.generateRandomToken();
  const hashedRefreshToken = tokenService.hashRandomToken(rawRefreshToken);

  await refreshTokenRepository.createRefreshToken({
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userId: existingUser.id,
  });

  const { credential: _credential, ...userData } = existingUser;

  logger.info({ userId: existingUser.id }, 'User logged in');

  return {
    userData,
    accessToken,
    refreshToken: rawRefreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  const hashedToken = tokenService.hashRandomToken(refreshToken);
  const existing = await refreshTokenRepository.findRefreshTokenByHash(hashedToken);

  if (!existing || existing.revokedAt) {
    throw new UnauthorizedError('Invalid token');
  }

  // 2. Revoke refresh token in database
  await refreshTokenRepository.revokeRefreshToken(existing.id);
}

export async function rotateRefreshToken(refreshToken: string) {
  const hashedToken = tokenService.hashRandomToken(refreshToken);
  const existing = await refreshTokenRepository.findRefreshTokenByHash(hashedToken);

  if (!existing) {
    logger.warn({}, 'Refresh token reuse detected or token invalid');
    throw new UnauthorizedError('Token reuse detected');
  }

  if (existing.revokedAt) {
    // A legitimate concurrent request (e.g. the middleware refreshing a page
    // navigation at the same moment a client-side fetch also hit a 401 and
    // refreshed) can present this same, now-revoked token microseconds after
    // the winning request rotated it. If that just happened, hand back the
    // same new token pair instead of treating it as theft.
    const cached = await redisClient.get(`refresh-grace:${hashedToken}`);

    if (cached) {
      return JSON.parse(cached) as { newAccessToken: string; newRefreshToken: string };
    }

    logger.warn({ userId: existing.userId }, 'Refresh token reuse detected or token invalid');
    throw new UnauthorizedError('Token reuse detected');
  }

  if (existing.expiresAt < new Date()) {
    logger.warn({ userId: existing.userId }, 'Refresh token reuse detected or token invalid');
    throw new UnauthorizedError('Token reuse detected');
  }

  let user;

  try {
    // find user using repo
    user = await userRepository.findUserById(existing.userId);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw error;
  }

  // revoke refresh tokens
  await refreshTokenRepository.revokeRefreshToken(existing.id);

  // discard and replace with new acess and refresh token
  const newAccessToken = tokenService.generateAccessToken(user);
  const newRefreshToken = tokenService.generateRandomToken();
  const hashedNewRefreshToken = tokenService.hashRandomToken(newRefreshToken);

  await refreshTokenRepository.createRefreshToken({
    userId: user.id,
    tokenHash: hashedNewRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const result = { newAccessToken, newRefreshToken };

  await redisClient.set(`refresh-grace:${hashedToken}`, JSON.stringify(result), {
    EX: REFRESH_TOKEN_REUSE_GRACE_SECONDS,
  });

  return result;
}

export async function requestPasswordReset({ email }: ForgotPasswordInput) {
  const user = await userRepository.findUserByLoginIdentifier(email);

  if (!user) {
    logger.warn({ email }, 'User could not be found');
    throw new BadRequestError('Reset token is invalid or expired');
  }

  // create access token
  const rawResetToken = tokenService.generateRandomToken();
  const hashedResetToken = tokenService.hashRandomToken(rawResetToken);

  // will be start in database to
  tokenRepository.upsertToken({
    userId: user.id,
    tokenHash: hashedResetToken,
    purpose: TokenPurpose.PASSWORD_RESET,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  return {
    rawResetToken,
  };
}

export async function resetUserPassword({ token, password }: { token: string; password: string }) {
  const hashedToken = tokenService.hashRandomToken(token);
  // Find valid token
  const validToken = await tokenRepository.findTokenByHash(
    hashedToken,
    TokenPurpose.PASSWORD_RESET,
  );

  if (!validToken || validToken.expiresAt < new Date()) {
    throw new BadRequestError('Reset token is invalid or expired');
  }

  // check whether user exists
  let user;

  try {
    user = await userRepository.findUserById(validToken.userId);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      logger.warn({ userId: validToken!.userId }, 'User could not be found');
      throw new UnauthorizedError('Password could not be created');
    }
    throw error;
  }

  // update new password
  const hashedPassword = await hash(password);

  const userData = await userRepository.updateCredential(user.id, hashedPassword);

  await tokenRepository.deleteToken(validToken.id);

  return userData;
}

export async function verifyUser(token: string) {
  const hashedToken = tokenService.hashRandomToken(token);
  // get user id from valid token
  const validToken = await tokenRepository.findTokenByHash(
    hashedToken,
    TokenPurpose.VERIFY_ACCOUNT,
  );

  if (!validToken || validToken.expiresAt < new Date()) {
    throw new BadRequestError('Verification token is invalid or expired');
  }

  // check whether user exists
  let user;

  try {
    // get user by using user id
    user = await userRepository.findUserById(validToken.userId);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      logger.warn({ userId: validToken.userId }, 'User could not be found');
      throw new UnauthorizedError('User could not be verified');
    }
    throw error;
  }

  // if user is  isVerified throw an error
  if (user.isVerified) {
    throw new BadRequestError('User already verified');
  }

  const newAccessToken = tokenService.generateAccessToken(user);
  const newRefreshToken = tokenService.generateRandomToken();

  const hashedRefreshToken = tokenService.hashRandomToken(newRefreshToken);

  await refreshTokenRepository.createRefreshToken({
    userId: user.id,
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  userRepository.updateUser(user.id, { isVerified: true });

  return {
    newAccessToken,
    newRefreshToken,
    userId: user.id,
  };
}
