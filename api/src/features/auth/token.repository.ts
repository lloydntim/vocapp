import logger from '../../config/logger.js';
import prisma from '../../db/client.js';
import { Token, TokenPurpose } from '../../generated/prisma/client.js';
import { handlePrismaError } from '../../utils/handlePrismaError.js';

type TokenInput = Pick<Token, 'userId' | 'tokenHash' | 'purpose' | 'expiresAt'>;

async function findTokenByUserId(userId: string): Promise<Token> {
  return handlePrismaError(prisma.token.findFirstOrThrow({ where: { userId } }), {
    P2025: 'Token does not exist',
  });
}

async function findTokenByHash(tokenHash: string, purpose: TokenPurpose): Promise<Token | null> {
  const token = await prisma.token.findUnique({ where: { tokenHash } });

  return token?.purpose === purpose ? token : null;
}

async function upsertToken(data: TokenInput): Promise<Token> {
  const token = await handlePrismaError(
    prisma.token.upsert({
      where: { userId_purpose: { userId: data.userId, purpose: data.purpose } },
      create: data,
      update: { tokenHash: data.tokenHash, expiresAt: data.expiresAt },
    }),
  );

  logger.info(
    {
      userId: token.userId,
      tokenId: token.id,
      purpose: token.purpose,
    },

    'Token was upserted',
  );

  return token;
}

async function deleteToken(id: string): Promise<void> {
  await handlePrismaError(prisma.token.delete({ where: { id } }), {
    P2025: 'Token does not exist',
  });
}

export default { upsertToken, findTokenByUserId, findTokenByHash, deleteToken };
