import type { NextFunction, Request, Response } from 'express';
import env from '../config/env.js';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  console.log(err);
  logger.error({ err }, 'Internal Error message');

  return res.status(500).json({
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
