import type { Request, Response } from 'express';
import logger from '../../config/logger.js';
import { ForbiddenError } from '../../errors/ForbiddenError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import User from '../../shared/types/user.types.js';
import userRepository from './user.repository.js';

type NoParams = Record<string, never>;

type SecureUser = Omit<User, 'password' | 'refresh_token'>;
interface UserResponse {
  accessToken?: string;
  data?: SecureUser | SecureUser[];
  message?: string;
}

function getUsers(req: Request<NoParams, UserResponse>, res: Response<UserResponse>) {
  if (!req.user) {
    throw new ForbiddenError('You are not authenticated to see this');
  }

  const users = userRepository.getUsers();
  if (!users) {
    logger.warn('No data available');
    throw new NotFoundError('Users cannot be found');
  }

  return res.status(200).json({
    message: 'Users successfully retrieved',
    data: users,
  });
}

function getUserById(req: Request<{ userId: string }, UserResponse>, res: Response<UserResponse>) {
  const { userId } = req.params;

  const user = userRepository.findUserById(userId);
  if (!user) {
    logger.warn('No data available');
    throw new NotFoundError('User cannot be found');
  }
  return res.status(200).json({
    message: 'User successfully retrieved',
    data: user,
  });
}

export default { getUsers, getUserById };
