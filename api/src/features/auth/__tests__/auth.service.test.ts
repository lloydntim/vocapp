import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('argon2', () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

vi.mock('../../users/user.repository.js', () => ({
  default: {
    findUserByLoginIdentifier: vi.fn(),
    findConflictingUser: vi.fn(),
    findUserById: vi.fn(),
    addUser: vi.fn(),
    updateUser: vi.fn(),
    updateCredential: vi.fn(),
  },
}));

vi.mock('../token.repository.js', () => ({
  default: {
    upsertToken: vi.fn(),
    findTokenByUserId: vi.fn(),
    findTokenByHash: vi.fn(),
    deleteToken: vi.fn(),
  },
}));

vi.mock('../refreshToken.repository.js', () => ({
  default: {
    createRefreshToken: vi.fn(),
    findRefreshTokenByHash: vi.fn(),
    revokeRefreshToken: vi.fn(),
  },
}));

vi.mock('../token.service.js', () => ({
  default: {
    generateAccessToken: vi.fn(),
    generateRandomToken: vi.fn(),
    hashRandomToken: vi.fn(),
  },
}));

vi.mock('../../../config/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../redis/client.js', () => ({
  default: { get: vi.fn(), set: vi.fn() },
}));

import { hash, verify } from 'argon2';
import { BadRequestError } from '../../../errors/BadRequestError.js';
import { ConflictError } from '../../../errors/ConflictError.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import { TokenPurpose } from '../../../generated/prisma/enums.js';
import userRepository from '../../users/user.repository.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  rotateRefreshToken,
  verifyUser,
} from '../auth.service.js';
import redisClient from '../../../redis/client.js';
import refreshTokenRepository from '../refreshToken.repository.js';
import tokenRepository from '../token.repository.js';
import tokenService from '../token.service.js';

const mockUser = {
  id: 'user-1',
  username: 'jdoe',
  email: 'jdoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER' as const,
  isVerified: false,
  plan: 'FREE' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserWithCredential = {
  ...mockUser,
  credential: {
    id: 'cred-1',
    userId: 'user-1',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const mockRefreshToken = {
  id: 'rt-1',
  userId: mockUser.id,
  tokenHash: 'hashed-token',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const registerInput = {
  firstName: 'Jane',
  lastName: 'Doe',
  username: 'newuser',
  email: 'new@example.com',
  password: 'plain-password',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(hash).mockResolvedValue('hashed-password');
  vi.mocked(verify).mockResolvedValue(true);
  vi.mocked(tokenService.generateAccessToken).mockReturnValue('access-token');
  vi.mocked(tokenService.generateRandomToken).mockReturnValue('raw-token');
  vi.mocked(tokenService.hashRandomToken).mockReturnValue('hashed-token');
});

describe('authService', () => {
  describe('registerUser', () => {
    it('returns userData and a success message', async () => {
      vi.mocked(userRepository.findConflictingUser).mockResolvedValue(null);
      vi.mocked(userRepository.addUser).mockResolvedValue(mockUser);

      const result = await registerUser(registerInput);

      expect(result.userData).not.toHaveProperty('password');
    });

    it('creates a verification token linked to the new user', async () => {
      vi.mocked(userRepository.findConflictingUser).mockResolvedValue(null);
      vi.mocked(userRepository.addUser).mockResolvedValue(mockUser);

      await registerUser(registerInput);

      expect(tokenService.generateRandomToken).toHaveBeenCalled();
      expect(tokenRepository.upsertToken).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUser.id, purpose: TokenPurpose.VERIFY_ACCOUNT }),
      );
    });

    it('throws ConflictError when username already exists', async () => {
      vi.mocked(userRepository.findConflictingUser).mockResolvedValue(mockUserWithCredential);

      await expect(registerUser(registerInput)).rejects.toThrow(ConflictError);
    });
  });

  describe('loginUser', () => {
    it('returns accessToken, refreshToken and userData on valid credentials', async () => {
      vi.mocked(userRepository.findUserByLoginIdentifier).mockResolvedValue(mockUserWithCredential);
      vi.mocked(refreshTokenRepository.createRefreshToken).mockResolvedValue(mockRefreshToken);

      const result = await loginUser({ username: 'jdoe', password: 'plain-password' });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('raw-token');
      expect(result.userData).not.toHaveProperty('password');
      expect(result.userData).not.toHaveProperty('credential');
    });

    it('throws UnauthorizedError when the user does not exist', async () => {
      vi.mocked(userRepository.findUserByLoginIdentifier).mockResolvedValue(null);

      await expect(loginUser({ username: 'unknown', password: 'pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('throws UnauthorizedError when the password does not match', async () => {
      vi.mocked(userRepository.findUserByLoginIdentifier).mockResolvedValue(mockUserWithCredential);
      vi.mocked(verify).mockResolvedValue(false);

      await expect(loginUser({ username: 'jdoe', password: 'wrong-pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('logoutUser', () => {
    it('revokes the stored refresh token', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue(mockRefreshToken);

      await logoutUser('some-refresh-token');

      expect(refreshTokenRepository.revokeRefreshToken).toHaveBeenCalledWith(mockRefreshToken.id);
    });

    it('throws when token not found in DB', async () => {
      await expect(logoutUser('invalid-token')).rejects.toThrow(UnauthorizedError);
    });

    it('throws UnauthorizedError when the refresh token is already revoked', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue({
        ...mockRefreshToken,
        revokedAt: new Date(),
      });

      await expect(logoutUser('revoked-token')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('rotateRefreshToken', () => {
    it('returns a new access token and refresh token', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue(mockRefreshToken);
      vi.mocked(userRepository.findUserById).mockResolvedValue(mockUser);

      const result = await rotateRefreshToken('valid-refresh-token');

      expect(result.newAccessToken).toBe('access-token');
      expect(result.newRefreshToken).toBe('raw-token');
    });

    it('stores the new refresh token hash', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue(mockRefreshToken);
      vi.mocked(userRepository.findUserById).mockResolvedValue(mockUser);

      await rotateRefreshToken('valid-refresh-token');

      expect(refreshTokenRepository.createRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUser.id }),
      );
    });

    it('throws UnauthorizedError when the refresh token is not found', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue(null);

      await expect(rotateRefreshToken('some-token')).rejects.toThrow(UnauthorizedError);
    });

    it('throws UnauthorizedError when the token is already revoked', async () => {
      vi.mocked(refreshTokenRepository.findRefreshTokenByHash).mockResolvedValue({
        ...mockRefreshToken,
        revokedAt: new Date(),
      });
      vi.mocked(redisClient.get).mockResolvedValue(null);

      await expect(rotateRefreshToken('reused-token')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('requestPasswordReset', () => {
    it('returns a raw reset token when the user exists', async () => {
      vi.mocked(userRepository.findUserByLoginIdentifier).mockResolvedValue(mockUserWithCredential);

      const result = await requestPasswordReset({ email: mockUser.email });

      expect(result.rawResetToken).toBe('raw-token');
      expect(tokenRepository.upsertToken).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUser.id, purpose: TokenPurpose.PASSWORD_RESET }),
      );
    });

    it('throws BadRequestError when the email is not registered', async () => {
      vi.mocked(userRepository.findUserByLoginIdentifier).mockResolvedValue(null);

      await expect(requestPasswordReset({ email: 'unknown@example.com' })).rejects.toThrow(
        BadRequestError,
      );
    });
  });

  describe('resetUserPassword', () => {
    const validToken = {
      id: 'token-1',
      userId: mockUser.id,
      tokenHash: 'hashed-token',
      purpose: TokenPurpose.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCredential = {
      id: 'cred-1',
      userId: mockUser.id,
      passwordHash: 'new-hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('hashes the new password and returns the updated credential without a password field', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue(validToken);
      vi.mocked(userRepository.findUserById).mockResolvedValue(mockUser);
      vi.mocked(userRepository.updateCredential).mockResolvedValue(mockCredential);

      const result = await resetUserPassword({ token: 'raw-token', password: 'new-password' });

      expect(hash).toHaveBeenCalledWith('new-password');
      expect(result).not.toHaveProperty('password');
      expect(tokenRepository.deleteToken).toHaveBeenCalledWith(validToken.id);
    });

    it('throws BadRequestError when the reset token has expired', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue({
        ...validToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(resetUserPassword({ token: 'raw-token', password: 'new-pass' })).rejects.toThrow(
        BadRequestError,
      );
    });

    it('throws UnauthorizedError when the user linked to the token does not exist', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue(validToken);
       
      vi.mocked(userRepository.findUserById).mockRejectedValueOnce(new NotFoundError('not found'));

      await expect(resetUserPassword({ token: 'raw-token', password: 'new-pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('verifyUser', () => {
    const validToken = {
      id: 'token-1',
      userId: mockUser.id,
      tokenHash: 'hashed-token',
      purpose: TokenPurpose.VERIFY_ACCOUNT,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('returns new tokens and marks the user as verified', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue(validToken);
      vi.mocked(userRepository.findUserById).mockResolvedValue({ ...mockUser, isVerified: false });
      vi.mocked(refreshTokenRepository.createRefreshToken).mockResolvedValue(mockRefreshToken);

      const result = await verifyUser('raw-token');

      expect(result.newAccessToken).toBe('access-token');
      expect(result.newRefreshToken).toBe('raw-token');
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ isVerified: true }),
      );
    });

    it('throws BadRequestError when the verification token has expired', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue({
        ...validToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(verifyUser('raw-token')).rejects.toThrow(BadRequestError);
    });

    it('throws BadRequestError when the user is already verified', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue(validToken);
      vi.mocked(userRepository.findUserById).mockResolvedValue({ ...mockUser, isVerified: true });

      await expect(verifyUser('raw-token')).rejects.toThrow(BadRequestError);
    });

    it('throws UnauthorizedError when the user linked to the token does not exist', async () => {
      vi.mocked(tokenRepository.findTokenByHash).mockResolvedValue(validToken);
       
      vi.mocked(userRepository.findUserById).mockRejectedValueOnce(new NotFoundError('not found'));

      await expect(verifyUser('raw-token')).rejects.toThrow(UnauthorizedError);
    });
  });
});
