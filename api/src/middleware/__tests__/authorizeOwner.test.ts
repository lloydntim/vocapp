import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenError } from '../../errors/ForbiddenError.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import authorizeOwner from '../authorizeOwner.js';

const mockResponse = {} as Response;
const mockNextFunction = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authorizeOwner middleware', () => {
  it('calls next when userId param matches the authenticated user', () => {
    const mockRequest = {
      params: { userId: 'user-1' },
      user: { sub: 'user-1' },
    } as unknown as Partial<Request> as Request;

    authorizeOwner(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('throws UnauthorizedError when request has no user', () => {
    const mockRequest = {
      params: { userId: 'user-1' },
    } as Partial<Request> as Request;

    expect(() => authorizeOwner(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new UnauthorizedError('User is not authenticated'),
    );
  });

  it('throws ForbiddenError when userId param does not match the authenticated user', () => {
    const mockRequest = {
      params: { userId: 'user-2' },
      user: { sub: 'user-1' },
    } as unknown as Partial<Request> as Request;

    expect(() => authorizeOwner(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new ForbiddenError('User does not have permissions'),
    );
  });
});
