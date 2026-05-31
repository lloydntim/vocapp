// src/shared/token/token.service.test.ts

import { afterEach, describe, expect, it, vi } from 'vitest';
import tokenService from '../token.service.js';

describe('tokenService', () => {
  describe('tokenService generation', () => {
    it('generates access token', () => {
      const payload = tokenService.generateAccessToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });
      expect(payload).toBeTypeOf('string');
    });

    it('generates refresh token', () => {
      const payload = tokenService.generateRefreshToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });
      expect(payload).toBeTypeOf('string');
    });

    it('generates random token', () => {
      const randomToken = tokenService.generateRandomToken();
      expect(randomToken).toBeTypeOf('string');
    });
  });

  describe('tokenService hashing', () => {
    it('returns a sha256 hash as a hex string', () => {
      const hash = tokenService.hashRandomToken('my-random-token');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('returns the same hash for the same input', () => {
      const hashA = tokenService.hashRandomToken('my-random-token');
      const hashB = tokenService.hashRandomToken('my-random-token');

      expect(hashA).toBe(hashB);
    });

    it('returns different hashes for different inputs', () => {
      const hashA = tokenService.hashRandomToken('token-one');
      const hashB = tokenService.hashRandomToken('token-two');

      expect(hashA).not.toBe(hashB);
    });
  });

  describe('tokenService verification', () => {
    it('signs and verifies an access token', () => {
      const token = tokenService.generateAccessToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });

      const payload = tokenService.verifyAccessToken(token);

      expect(payload.sub).toBe('user_123');
      expect(payload.email).toBe('lloyd@example.com');
      expect(payload.role).toBe('user');
      expect(payload.exp).toBeTypeOf('number');
      expect(payload.iat).toBeTypeOf('number');
    });

    it('signs and verifies a refresh token', () => {
      const token = tokenService.generateRefreshToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });

      const payload = tokenService.verifyRefreshToken(token);

      expect(payload.sub).toBe('user_123');
      expect(payload.email).toBe('lloyd@example.com');
      expect(payload.role).toBe('user');
      expect(payload.exp).toBeTypeOf('number');
      expect(payload.iat).toBeTypeOf('number');
    });

    it('signs and verifies an access token', () => {
      const token = tokenService.generateAccessToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });

      const payload = tokenService.verifyAccessToken(token);

      expect(payload.sub).toBe('user_123');
      expect(payload.email).toBe('lloyd@example.com');
      expect(payload.role).toBe('user');
      expect(payload.exp).toBeTypeOf('number');
      expect(payload.iat).toBeTypeOf('number');
    });
  });

  describe('tokenService expiry', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('throws when the access token has expired', () => {
      vi.useFakeTimers();

      vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));

      const token = tokenService.generateAccessToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });

      vi.setSystemTime(new Date('2026-01-01T10:03:00Z'));

      expect(() => {
        tokenService.verifyAccessToken(token);
      }).toThrow();
    });

    it('throws when the refresh token has expired', () => {
      vi.useFakeTimers();

      vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));

      const token = tokenService.generateRefreshToken({
        id: 'user_123',
        email: 'lloyd@example.com',
        role: 'user',
      });

      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));

      expect(() => {
        tokenService.verifyRefreshToken(token);
      }).toThrow();
    });
  });
});
