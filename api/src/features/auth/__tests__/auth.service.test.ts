import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('argon2', () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

vi.mock('../../users/user.repository.js', () => ({
  default: {
    findUser: vi.fn(),
    findUserById: vi.fn(),
    addUser: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('../token.repository.js', () => ({
  default: {
    addToken: vi.fn(),
    findValidToken: vi.fn(),
  },
}));

vi.mock('../token.service.js', () => ({
  default: {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    generateRandomToken: vi.fn(),
    hashRandomToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
  },
}));

vi.mock('../../../config/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { hash, verify } from 'argon2';
import { BadRequestError } from '../../../errors/BadRequestError.js';
import { ConflictError } from '../../../errors/ConflictError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
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
import tokenRepository from '../token.repository.js';
import tokenService from '../token.service.js';

const mockUser = {
  id: 'user-1',
  username: 'jdoe',
  email: 'jdoe@example.com',
  password: 'hashed-password',
  first_name: 'John',
  last_name: 'Doe',
  role: 'user' as const,
  is_verified: false,
  refresh_token: 'stored-hashed-refresh-token',
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
  vi.mocked(tokenService.generateRefreshToken).mockReturnValue('refresh-token');
  vi.mocked(tokenService.generateRandomToken).mockReturnValue('raw-token');
  vi.mocked(tokenService.hashRandomToken).mockReturnValue('hashed-token');
});

describe('authService', () => {
  describe('registerUser', () => {
    it('returns userData and a success message', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(undefined);
      vi.mocked(userRepository.addUser).mockReturnValue({
        ...mockUser,
        username: registerInput.username,
      });

      const result = await registerUser(registerInput);

      expect(result.userData).not.toHaveProperty('password');
    });

    it('creates a verification token linked to the new user', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(undefined);
      vi.mocked(userRepository.addUser).mockReturnValue(mockUser);

      await registerUser(registerInput);

      expect(tokenService.generateRandomToken).toHaveBeenCalled();
      expect(tokenRepository.addToken).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: mockUser.id, purpose: 'verify_account' }),
      );
    });

    it('throws ConflictError when username already exists', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(mockUser);

      await expect(registerUser(registerInput)).rejects.toThrow(ConflictError);
    });
  });

  describe('loginUser', () => {
    it('returns accessToken, refreshToken and userData on valid credentials', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(mockUser);

      const result = await loginUser({ username: 'jdoe', password: 'plain-password' });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.userData).not.toHaveProperty('password');
      expect(result.userData).not.toHaveProperty('refresh_token');
    });

    it('throws UnauthorizedError when the user does not exist', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(undefined);

      await expect(loginUser({ username: 'unknown', password: 'pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('throws UnauthorizedError when the password does not match', async () => {
      vi.mocked(userRepository.findUser).mockReturnValue(mockUser);
      vi.mocked(verify).mockResolvedValue(false);

      await expect(loginUser({ username: 'jdoe', password: 'wrong-pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('logoutUser', () => {
    it('clears the stored refresh token for the authenticated user', () => {
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: 'user',
      });

      logoutUser('some-refresh-token');

      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser.id, { refresh_token: '' });
    });

    it('throws UnauthorizedError when the token has no subject claim', () => {
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        email: mockUser.email,
        role: 'user',
      });

      expect(() => logoutUser('invalid-token')).toThrow(UnauthorizedError);
    });
  });

  describe('rotateRefreshToken', () => {
    it('returns a new access token and refresh token', async () => {
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: 'user',
      });
      vi.mocked(userRepository.findUserById).mockReturnValue(mockUser);

      const result = await rotateRefreshToken('valid-refresh-token');

      expect(result.newAccessToken).toBe('access-token');
      expect(result.newRefreshToken).toBe('refresh-token');
    });

    it('hashes the new refresh token before storing it', async () => {
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: 'user',
      });
      vi.mocked(userRepository.findUserById).mockReturnValue(mockUser);

      await rotateRefreshToken('valid-refresh-token');

      expect(hash).toHaveBeenCalledWith('refresh-token');
    });

    it('throws UnauthorizedError when the user has no stored refresh token', async () => {
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: 'user',
      });
      const { refresh_token: _, ...userWithoutToken } = mockUser;
      vi.mocked(userRepository.findUserById).mockReturnValue(userWithoutToken);

      await expect(rotateRefreshToken('some-token')).rejects.toThrow(UnauthorizedError);
    });

    it('clears the token and throws UnauthorizedError when token reuse is detected', async () => {
      const user = { ...mockUser };
      vi.mocked(tokenService.verifyRefreshToken).mockReturnValue({
        sub: user.id,
        email: user.email,
        role: 'user',
      });
      vi.mocked(userRepository.findUserById).mockReturnValue(user);
      vi.mocked(verify).mockResolvedValue(false);

      await expect(rotateRefreshToken('reused-token')).rejects.toThrow(UnauthorizedError);
      expect(user.refresh_token).toBe('');
    });
  });

  describe('requestPasswordReset', () => {
    it('returns a raw reset token when the user exists', () => {
      vi.mocked(userRepository.findUser).mockReturnValue(mockUser);

      const result = requestPasswordReset({ email: mockUser.email });

      expect(result.rawResetToken).toBe('raw-token');
      expect(tokenRepository.addToken).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: mockUser.id, purpose: 'reset_password' }),
      );
    });

    it('throws BadRequestError when the email is not registered', () => {
      vi.mocked(userRepository.findUser).mockReturnValue(undefined);

      expect(() => requestPasswordReset({ email: 'unknown@example.com' })).toThrow(BadRequestError);
    });
  });

  describe('resetUserPassword', () => {
    const validToken = {
      id: 'token-1',
      user_id: mockUser.id,
      token_hash: 'hashed-token',
      purpose: 'reset_password' as const,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    };

    it('hashes the new password and returns userData without the password field', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue(validToken);
      vi.mocked(userRepository.findUserById).mockReturnValue(mockUser);

      const result = await resetUserPassword({ token: 'raw-token', password: 'new-password' });

      expect(hash).toHaveBeenCalledWith('new-password');
      expect(result).not.toHaveProperty('password');
    });

    it('throws BadRequestError when the reset token has expired', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue({
        ...validToken,
        expires_at: new Date(Date.now() - 1000),
      });

      await expect(resetUserPassword({ token: 'raw-token', password: 'new-pass' })).rejects.toThrow(
        BadRequestError,
      );
    });

    it('throws UnauthorizedError when the user linked to the token does not exist', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue(validToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(userRepository.findUserById).mockReturnValue(undefined as any);

      await expect(resetUserPassword({ token: 'raw-token', password: 'new-pass' })).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('verifyUser', () => {
    const validToken = {
      id: 'token-1',
      user_id: mockUser.id,
      token_hash: 'hashed-token',
      purpose: 'verify_account' as const,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    };

    it('returns new tokens and marks the user as verified', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue(validToken);
      vi.mocked(userRepository.findUserById).mockReturnValue({ ...mockUser, is_verified: false });

      const result = await verifyUser('raw-token');

      expect(result.newAccessToken).toBe('access-token');
      expect(result.newRefreshToken).toBe('refresh-token');
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ is_verified: true }),
      );
    });

    it('throws BadRequestError when the verification token has expired', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue({
        ...validToken,
        expires_at: new Date(Date.now() - 1000),
      });

      await expect(verifyUser('raw-token')).rejects.toThrow(BadRequestError);
    });

    it('throws BadRequestError when the user is already verified', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue(validToken);
      vi.mocked(userRepository.findUserById).mockReturnValue({ ...mockUser, is_verified: true });

      await expect(verifyUser('raw-token')).rejects.toThrow(BadRequestError);
    });

    it('throws UnauthorizedError when the user linked to the token does not exist', async () => {
      vi.mocked(tokenRepository.findValidToken).mockReturnValue(validToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(userRepository.findUserById).mockReturnValue(undefined as any);

      await expect(verifyUser('raw-token')).rejects.toThrow(UnauthorizedError);
    });
  });
});
