import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

function authorizeOwner(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError('User is not authenticated');
  }

  if (req.params.userId !== req.user.sub) {
    throw new ForbiddenError('User does not have permissions');
  }

  next();
}

export default authorizeOwner;
