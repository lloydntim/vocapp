import { describe, expect, it, vi } from 'vitest';
import prisma from '../../../db/client.js';

import { NotFoundError } from '../../../errors/NotFoundError.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { TokenPurpose } from '../../../generated/prisma/enums.js';
import tokenRepository from '../token.repository.js';

vi.mock('../../../db/client.js', () => ({
  default: {
    token: {
      create: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      findFirstOrThrow: vi.fn(),
    },
  },
}));
const mockToken = {
  id: 't-1',
  userId: 'user-1',
  tokenHash: 'hashed-xyz',
  expiresAt: new Date('2099-01-01'),
  purpose: TokenPurpose.PASSWORD_RESET as TokenPurpose,
  revokedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('tokenRepository', () => {
  describe('findTokenByUserId', () => {
    it('returns token when user id is valid', async () => {
      vi.mocked(prisma.token.findFirstOrThrow).mockResolvedValue(mockToken);

      const result = await tokenRepository.findTokenByUserId(mockToken.userId);

      expect(result).toEqual(mockToken);
    });

    it('throws NotFoundError when id is not found', async () => {
      vi.mocked(prisma.token.findFirstOrThrow).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Not found', {
          code: 'P2025',
          clientVersion: '',
        }),
      );

      await expect(tokenRepository.findTokenByUserId('unknown-id')).rejects.toThrow(NotFoundError);
    });
  });
  describe('findTokenByHash', () => {
    it('returns token when hash and purpose match', async () => {
      vi.mocked(prisma.token.findUnique).mockResolvedValue(mockToken);
      const result = await tokenRepository.findTokenByHash(
        'hashed-xyz',
        TokenPurpose.PASSWORD_RESET,
      );
      expect(result).toEqual(mockToken);
    });

    it('returns null when hash is not found', async () => {
      vi.mocked(prisma.token.findUnique).mockResolvedValue(null);
      const result = await tokenRepository.findTokenByHash('unknown', TokenPurpose.PASSWORD_RESET);
      expect(result).toBeNull();
    });

    it('returns null when the purpose does not match', async () => {
      vi.mocked(prisma.token.findUnique).mockResolvedValue(null);
      const result = await tokenRepository.findTokenByHash(
        'hashed-xyz',
        TokenPurpose.VERIFY_ACCOUNT,
      );
      expect(result).toBeNull();
    });
  });

  describe('upsertToken', () => {
    it('returns token that was upserted', async () => {
      vi.mocked(prisma.token.upsert).mockResolvedValue(mockToken);
      const { userId, tokenHash, purpose } = mockToken;
      const result = await tokenRepository.upsertToken({
        userId,
        tokenHash,
        purpose,
        expiresAt: new Date('2099-01-01'),
      });
      expect(result).toEqual(mockToken);
    });
  });

  describe('deleteToken', () => {
    it('resolves without throwing when token exists', async () => {
      vi.mocked(prisma.token.delete).mockResolvedValue(mockToken);

      await expect(tokenRepository.deleteToken('t-1')).resolves.toBeUndefined();
    });

    it('throws NotFoundError when token does not exist', async () => {
      vi.mocked(prisma.token.delete).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Not found', {
          code: 'P2025',
          clientVersion: '',
        }),
      );

      await expect(tokenRepository.deleteToken('missing-id')).rejects.toThrow(NotFoundError);
    });
  });
});
