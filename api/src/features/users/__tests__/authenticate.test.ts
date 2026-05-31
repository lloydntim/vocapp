import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import authenticate from '../../../middleware/authenticate.js';

import { AuthenticatedUser } from '../../auth/auth.types.js';
import tokenService from '../../auth/token.service.js';

vi.mock('../../auth/token.service.js', () => ({
  default: {
    verifyAccessToken: vi.fn(),
  },
}));

const mockDecoded = {
  sub: '01',
  email: 'jdoe@mail.com',
  role: 'user',
} as AuthenticatedUser;

const mockNextFunction = vi.fn();
const emptyResponse = {} as Response;
describe('authenticate', () => {
  it('returns token when user id is valid', () => {
    const authRequestHeader = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request;

    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue(mockDecoded);

    authenticate(authRequestHeader, emptyResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('throws error when no authorisation header is provided', () => {
    const emptyAuthHeader = { headers: { accept: '*' } } as Request;
    authenticate(emptyAuthHeader, emptyResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('throws error when no token is provided', () => {
    const authRequestHeader = {
      headers: {
        authorization: 'invalid',
      },
    } as Request;

    authenticate(authRequestHeader, emptyResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
