import type { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import logger from '../config/logger.js';
import { BadRequestError } from '../errors/BadRequestError.js';

function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      });

      // req.query is a getter-only accessor in Express 5, so it can't be
      // reassigned here; body/params are plain properties and safe to update.
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params;

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
