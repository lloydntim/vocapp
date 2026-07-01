import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenError } from '../../errors/ForbiddenError.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import { UserRole } from '../../generated/prisma/enums.js';
import authorize from '../authorize.js';

const mockResponse = {} as Response;
const mockNextFunction = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authorize middleware', () => {
  it('calls next when user role matches the required role', () => {
    const mockRequest = {
      user: { sub: 'user-1', role: UserRole.USER },
    } as Partial<Request> as Request;

    authorize(UserRole.USER)(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('calls next when admin role matches the required admin role', () => {
    const mockRequest = {
      user: { sub: 'user-1', role: UserRole.ADMIN },
    } as Partial<Request> as Request;

    authorize(UserRole.ADMIN)(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('throws UnauthorizedError when request has no user', () => {
    const mockRequest = {} as Partial<Request> as Request;

    expect(() => authorize(UserRole.ADMIN)(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new UnauthorizedError('User is not authenticated'),
    );
  });

  it('throws ForbiddenError when user role does not match the required role', () => {
    const mockRequest = {
      user: { sub: 'user-1', role: UserRole.USER },
    } as Partial<Request> as Request;

    expect(() => authorize(UserRole.ADMIN)(mockRequest, mockResponse, mockNextFunction)).toThrow(
      new ForbiddenError('User does not have permissions'),
    );
  });
});
