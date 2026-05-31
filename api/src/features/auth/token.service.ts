import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import crypto, { createHash } from 'node:crypto';
import env from '../../config/env.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import type User from '../../shared/types/user.types.js';
import type { AuthenticatedUser } from './auth.types.js';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env;

type Payload = Pick<User, 'id' | 'email' | 'role'>;

function generateAccessToken({ id: sub, email, role }: Payload): string {
  return jwt.sign({ sub, email, role }, JWT_ACCESS_SECRET, { expiresIn: '2m', algorithm: 'HS256' });
}

function generateRefreshToken({ id: sub, email, role }: Payload): string {
  return jwt.sign({ sub, email, role }, JWT_REFRESH_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
}

function verifyAccessToken(token: string): AuthenticatedUser {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ['HS256'] }) as AuthenticatedUser;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('Access Token Expired', 'ACCESS_TOKEN_EXPIRED');
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError('Invalid Acces Token', 'INVALID_ACCESS_TOKEN');
    }
    throw new UnauthorizedError('Authentication failed');
  }
}

function verifyRefreshToken(token: string): AuthenticatedUser {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as AuthenticatedUser;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('Refresh Token Expired', 'TOKEN_EXPIRED');
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError('Invalid Refresh Token', 'INVALID_REFRESH_TOKEN');
    }
    throw new UnauthorizedError('Authentication failed');
  }
}

function generateRandomToken() {
  return crypto.randomBytes(32).toString();
}

function hashRandomToken(randomToken: string) {
  return createHash('sha256').update(randomToken).digest('hex');
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRandomToken,
  hashRandomToken,
};
