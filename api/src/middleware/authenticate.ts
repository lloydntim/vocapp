import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import tokenService from '../features/auth/token.service.js';

function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('No authorisation header provided'));
  }

  if (!authHeader.startsWith('Bearer')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = authHeader.slice('Bearer '.length);

  const decoded = tokenService.verifyAccessToken(token);

  req.user = decoded;
  next();
}

export default authenticate;
