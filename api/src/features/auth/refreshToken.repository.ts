import logger from '../../config/logger.js';
import prisma from '../../db/client.js';
import { RefreshToken } from '../../generated/prisma/client.js';
import { handlePrismaError } from '../../utils/handlePrismaError.js';

type RefreshTokenInput = Pick<RefreshToken, 'userId' | 'tokenHash' | 'expiresAt'>;

async function createRefreshToken(data: RefreshTokenInput): Promise<RefreshToken> {
  const newRefreshToken = await prisma.refreshToken.create({
    data,
  });

  logger.info({ refreshTokenId: newRefreshToken.id }, 'Refresh Token was created');

  return newRefreshToken;
}

async function findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
  return prisma.refreshToken.findUnique({ where: { tokenHash } });
}

async function revokeRefreshToken(id: string): Promise<void> {
  await handlePrismaError(
    prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } }),
    {
      P2025: 'Refresh token does not exist',
    },
  );
}

export default { createRefreshToken, findRefreshTokenByHash, revokeRefreshToken };
