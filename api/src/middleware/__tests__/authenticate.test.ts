import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import authenticate from '../authenticate.js';

vi.mock('../../features/auth/token.service.js', () => ({
  default: {
    verifyAccessToken: vi
      .fn()
      .mockReturnValue({ id: 'user-1', email: 'user@example.com', role: 'USER' }),
  },
}));

const mockResponse = {} as Response;
const mockNextFunction = vi.fn() as NextFunction;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authenticate middleware', () => {
  it('calls next with no error when a valid bearer token is provided', () => {
    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    } as Partial<Request> as Request;

    authenticate(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith();
  });

  it('calls next with UnauthorizedError when no authorization header is provided', () => {
    const mockRequest = { headers: {} } as Partial<Request> as Request;

    expect(() => authenticate(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new UnauthorizedError('No authorisation header provided'),
    );
  });

  it('calls next with UnauthorizedError when authorization header has no bearer token', () => {
    const mockRequest = {
      headers: { authorization: 'Basic sometoken' },
    } as Partial<Request> as Request;

    expect(() => authenticate(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new UnauthorizedError('No token provided'),
    );
  });
});
