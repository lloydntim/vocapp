import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { RateLimiterMemory, RateLimiterRes, type RateLimiterLike } from 'rate-limiter-flexible';
import { TooManyRequestsError } from '../errors/TooManyRequestsError.js';

type RateLimitOptions = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration?: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
  limiter?: RateLimiterLike;
};

const getIpKey = (req: Request) => req.ip ?? req.socket.remoteAddress ?? 'anonymous';

const setRateLimitHeaders = (res: Response, limit: number, rateLimiterRes: RateLimiterRes) => {
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(rateLimiterRes.remainingPoints, 0));
  res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000));
};

export const createRateLimitMiddleware = ({
  keyPrefix,
  points,
  duration,
  blockDuration,
  message,
  keyGenerator = getIpKey,
  limiter = new RateLimiterMemory({
    keyPrefix,
    points,
    duration,
    ...(blockDuration === undefined ? {} : { blockDuration }),
  }),
}: RateLimitOptions): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    try {
      const rateLimiterRes = await limiter.consume(keyGenerator(req));
      setRateLimitHeaders(res, points, rateLimiterRes);

      return next();
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        setRateLimitHeaders(res, points, error);
        res.setHeader('Retry-After', Math.ceil(error.msBeforeNext / 1000));

        return next(new TooManyRequestsError(message));
      }

      return next(error);
    }
  };
};

export const apiRateLimit = createRateLimitMiddleware({
  keyPrefix: 'api',
  points: 300,
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

export const authRateLimit = createRateLimitMiddleware({
  keyPrefix: 'auth',
  points: 10,
  duration: 15 * 60,
  blockDuration: 15 * 60,
  message: 'Too many authentication attempts, please try again later',
  keyGenerator: (req) => `${getIpKey(req)}:${req.body?.username ?? req.body?.email ?? 'unknown'}`,
});

export const passwordResetRateLimit = createRateLimitMiddleware({
  keyPrefix: 'password-reset',
  points: 5,
  duration: 60 * 60,
  blockDuration: 60 * 60,
  message: 'Too many password reset attempts, please try again later',
  keyGenerator: (req) => `${getIpKey(req)}:${req.body?.email ?? 'unknown'}`,
});

export const sessionRateLimit = createRateLimitMiddleware({
  keyPrefix: 'session',
  points: 30,
  duration: 15 * 60,
  blockDuration: 15 * 60,
  message: 'Too many session requests, please try again later',
});
