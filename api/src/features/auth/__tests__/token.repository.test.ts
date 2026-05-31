import { describe, expect, it } from 'vitest';
import { BadRequestError } from '../../../errors/BadRequestError.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { TOKEN_PURPOSES, TokenPurpose } from '../auth.types.js';
import tokenRepository from '../token.repository.js';

describe('tokenRepository', () => {
  describe('findTokenByUserId', () => {
    it('returns token when user id is valid', () => {
      expect(tokenRepository.findTokenByUserId('12')).toEqual({
        id: '01',
        user_id: '12',
        token_hash: '23093',
        purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
        expires_at: new Date('2099-01-01'),
      });
    });

    it('returns undefined when id is not valid', () => {
      expect(tokenRepository.findTokenByUserId('1')).not.toBeDefined();
    });
  });
  describe('findValidToken', () => {
    it('returns token valid token when there is a match', () => {
      expect(tokenRepository.findValidToken('23093')).toEqual({
        id: '01',
        user_id: '12',
        token_hash: '23093',
        purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
        expires_at: new Date('2099-01-01'),
      });
    });
    it('throws errorwhen there is no match', () => {
      expect(() => tokenRepository.findValidToken('234343')).toThrow(NotFoundError);
    });
  });

  describe('addToken', () => {
    it('returns token that was added', () => {
      expect(
        tokenRepository.addToken({
          id: '03',
          user_id: '14',
          token_hash: '23093',
          purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
          expires_at: new Date('2099-01-01'),
        }),
      ).toMatchObject({
        user_id: '14',
        token_hash: '23093',
        purpose: TOKEN_PURPOSES.RESET_PASSWORD,
        expires_at: new Date('2099-01-01'),
      });
    });
    it('throws error valid when token exists', () => {
      expect(() =>
        tokenRepository.addToken({
          id: '03',
          user_id: '12',
          token_hash: '23093',
          purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
          expires_at: new Date('2099-01-01'),
        }),
      ).toThrow(BadRequestError);
    });
  });
});
