import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import type { UserRole } from '../shared/types/user.types.js';

function authorize(role: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('User is not authenticated');
    }

    if (req.user.role !== role) {
      throw new UnauthorizedError('User does not have permissions');
    }
    next();
  };
}

export default authorize;
