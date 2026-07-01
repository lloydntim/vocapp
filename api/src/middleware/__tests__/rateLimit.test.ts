import type { NextFunction, Request, Response } from 'express';
import { RateLimiterLike, RateLimiterRes } from 'rate-limiter-flexible';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TooManyRequestsError } from '../../errors/TooManyRequestsError.js';
import { createRateLimitMiddleware } from '../rateLimit.js';

const mockRequest = {
  params: {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    listId: '550e8400-e29b-41d4-a716-446655440001',
  },
  body: {
    username: 'johndoe',
    email: 'johndoe@mail.com',
  },
  query: {},
  ip: '192.168.1.1',
} as Partial<Request> as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

const mockNextFn = vi.fn() as NextFunction;

const mockResponse = {
  setHeader: vi.fn(),
} as Partial<Response> as Response;

const mockAuthKeyGenerator = vi.fn(
  (req: Request) => `${req.ip}:${req.body?.username ?? req.body?.email ?? 'unknown'}`,
);

const mockRateLimitOptions = {
  keyPrefix: 'mock-auth',
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
  message: 'Too many attemps, try later',
  keyGenerator: mockAuthKeyGenerator,
};

describe('rateLimit middleware', () => {
  it('calls next function and passes through when all parameters are set', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockRateLimit = createRateLimitMiddleware(mockRateLimitOptions);

    await mockRateLimit(mockRequest, mockResponse, mockNextFn);

    process.env.NODE_ENV = originalEnv;

    expect(mockNextFn).toHaveBeenCalled();
    expect(mockAuthKeyGenerator).toHaveBeenCalledWith(mockRequest);
  });

  it('calls next funtion with  TooManyRequestsError when request is invalid', async () => {
    const mockRes = new RateLimiterRes(0, 30000, 5, false);
    const mockLimiter = {
      consume: vi.fn().mockRejectedValue(mockRes),
    } as Partial<RateLimiterLike> as RateLimiterLike;

    const mockRateLimitOptionsFailing = {
      ...mockRateLimitOptions,
      limiter: mockLimiter,
    };

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockRateLimit = createRateLimitMiddleware(mockRateLimitOptionsFailing);

    await mockRateLimit(mockRequest, mockResponse, mockNextFn);

    process.env.NODE_ENV = originalEnv;

    expect(mockNextFn).toHaveBeenCalledWith(expect.any(TooManyRequestsError));
    const [error] = vi.mocked(mockNextFn).mock.calls[0]!;
    expect(error).toBeInstanceOf(TooManyRequestsError);
    expect(error).toMatchObject({ message: 'Too many attemps, try later' });

    expect(mockResponse.setHeader).toHaveBeenCalledWith('Retry-After', 30);
  });
});
