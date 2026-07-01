import type { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import logger from '../config/logger.js';
import { BadRequestError } from '../errors/BadRequestError.js';

function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        logger.warn({ issues: error.issues }, 'Validation failed on incoming request body');
        throw new BadRequestError('The form data is invalid');
      } else {
        throw error;
      }
    }
  };
}

export default validate;
