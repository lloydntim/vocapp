import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../../../db/client.js';
import refreshTokenRepository from '../refreshToken.repository.js';

vi.mock('../../../db/client.js', () => ({
  default: {
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockToken = {
  id: 'rt-1',
  userId: 'user-1',
  tokenHash: 'hashed-xyz',
  expiresAt: new Date('2099-01-01'),
  revokedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => vi.clearAllMocks());

describe('refreshTokenRepository', () => {
  describe('createRefreshToken', () => {
    it('returns the created token', async () => {
      vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockToken);

      const result = await refreshTokenRepository.createRefreshToken({
        userId: mockToken.userId,
        tokenHash: mockToken.tokenHash,
        expiresAt: mockToken.expiresAt,
      });

      expect(result).toEqual(mockToken);
    });
  });

  describe('findRefreshTokenByHash', () => {
    it('returns token when hash matches', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockToken);

      const result = await refreshTokenRepository.findRefreshTokenByHash('hashed-xyz');

      expect(result).toEqual(mockToken);
    });

    it('returns null when hash is not found', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null);

      const result = await refreshTokenRepository.findRefreshTokenByHash('unknown');

      expect(result).toBeNull();
    });
  });

  describe('revokeRefreshToken', () => {
    it('resolves without throwing', async () => {
      vi.mocked(prisma.refreshToken.update).mockResolvedValue({
        ...mockToken,
        revokedAt: new Date(),
      });

      await expect(refreshTokenRepository.revokeRefreshToken('rt-1')).resolves.toBeUndefined();
    });
  });
});
