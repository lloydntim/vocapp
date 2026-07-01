import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequestError } from '../../errors/BadRequestError.js';
import { ConflictError } from '../../errors/ConflictError.js';
import { ForbiddenError } from '../../errors/ForbiddenError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { TooManyRequestsError } from '../../errors/TooManyRequestsError.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import errorHandler from '../errorHandler.js';

const mockRequest = {} as Request;

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as Response;

const mockNextFunction = vi.fn() as NextFunction;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('errorHandler middleware', () => {
  it('returns 400 with default message for BadRequestError', () => {
    errorHandler(new BadRequestError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Bad request',
      code: 'BAD_REQUEST',
    });
  });

  it('returns 400 with custom message for BadRequestError', () => {
    errorHandler(
      new BadRequestError('Custom bad request message'),
      mockRequest,
      mockResponse,
      mockNextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Custom bad request message',
      code: 'BAD_REQUEST',
    });
  });

  it('returns 401 for UnauthorizedError', () => {
    errorHandler(new UnauthorizedError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
    });
  });

  it('returns 403 for ForbiddenError', () => {
    errorHandler(new ForbiddenError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Forbidden',
      code: 'FORBIDDEN',
    });
  });

  it('returns 404 for NotFoundError', () => {
    errorHandler(new NotFoundError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Resource not found',
      code: 'NOT_FOUND',
    });
  });

  it('returns 409 for ConflictError', () => {
    errorHandler(new ConflictError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Conflict',
      code: 'CONFLICT',
    });
  });

  it('returns 429 for TooManyRequestsError', () => {
    errorHandler(new TooManyRequestsError(), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Too many requests, please try again later',
      code: 'TOO_MANY_REQUESTS',
    });
  });

  it('returns 500 for unexpected errors', () => {
    errorHandler(new Error('something broke'), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'something broke',
      code: 'INTERNAL_ERROR',
    });
  });

  it('returns 500 with fallback message when error has no message', () => {
    errorHandler(new Error(''), mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  });
});
