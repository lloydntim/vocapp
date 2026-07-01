import jwt from 'jsonwebtoken';
import crypto, { createHash } from 'node:crypto';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import type { User } from '../../generated/prisma/client.js';
import type { AuthenticatedUser } from './auth.types.js';

const { JWT_ACCESS_SECRET } = env;

type Payload = Pick<User, 'id' | 'email' | 'role'>;

function generateAccessToken({ id: sub, email, role }: Payload): string {
  return jwt.sign({ sub, email, role }, JWT_ACCESS_SECRET, { expiresIn: '2m', algorithm: 'HS256' });
}

function verifyAccessToken(token: string): AuthenticatedUser {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ['HS256'] }) as AuthenticatedUser;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn({ code: 'ACCESS_TOKEN_EXPIRED' }, 'Token verification failed: expired');
      throw new UnauthorizedError(error.message, 'ACCESS_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn({ code: 'INVALID_ACCESS_TOKEN' }, 'Token verification failed: invalid');
      throw new UnauthorizedError(error.message, 'INVALID_ACCESS_TOKEN');
    }
    logger.error({ error }, 'Token verification failed: unexpected error');
    throw new UnauthorizedError('Authentication failed');
  }
}

function generateRandomToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashRandomToken(randomToken: string) {
  return createHash('sha256').update(randomToken).digest('hex');
}

export default {
  generateAccessToken,
  verifyAccessToken,
  generateRandomToken,
  hashRandomToken,
};
