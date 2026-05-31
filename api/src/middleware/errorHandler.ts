import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';

export default function errorHander(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  logger.error(`Internal Error message: ${err.message}`);

  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
