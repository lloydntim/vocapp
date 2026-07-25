import type { Request, Response } from 'express';
import logger from '../../config/logger.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import type { User } from '../../generated/prisma/client.js';
import { NoParams } from '../../shared/types/index.js';
import userRepository from './user.repository.js';
import userService from './user.service.js';

interface UserResponse {
  data?: User | User[];
  message?: string;
}

async function getUsers(req: Request<NoParams, UserResponse>, res: Response<UserResponse>) {
  const users = await userRepository.findUsers();

  if (!users) {
    logger.warn('No data available');
    throw new NotFoundError('Users cannot be found');
  }

  return res.status(200).json({
    message: 'Users successfully retrieved',
    data: users,
  });
}

async function getUserById(
  req: Request<{ userId: string }, UserResponse>,
  res: Response<UserResponse>,
) {
  const user = await userService.getUserById(req.params.userId);

  return res.status(200).json({
    message: 'User successfully retrieved',
    data: user,
  });
}

async function getMe(req: Request<NoParams, UserResponse>, res: Response<UserResponse>) {
  const user = await userService.getUserById(req.user.sub!);

  return res.status(200).json({
    data: user,
  });
}

export async function updateUser(req: Request<{ userId: string }>, res: Response<UserResponse>) {
  const updatedVocabList = await userService.updateUser(req.params.userId, req.body);

  logger.info({ userId: req.user.id }, 'User Account has been updated');

  res.status(200).json({
    data: updatedVocabList,
    message: 'User Account has been updated successfully',
  });
}

export async function deleteUser(req: Request<{ userId: string }>, res: Response<{}>) {
  await userService.deleteUser(req.params.userId);

  logger.info({ listId: req.params.userId }, 'User Account has been deleted successfully');

  res.status(204).send();
}

async function getUserVocabListSessions(
  req: Request<{ userId: string }, UserResponse>,
  res: Response<UserResponse>,
) {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);
  if (!user) {
    logger.warn('No data available');
    throw new NotFoundError('User cannot be found');
  }
  return res.status(200).json({
    message: 'User successfully retrieved',
    data: user,
  });
}
async function getUserVocabListSession(
  req: Request<{ userId: string }, UserResponse>,
  res: Response<UserResponse>,
) {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);
  if (!user) {
    logger.warn('No data available');
    throw new NotFoundError('User cannot be found');
  }
  return res.status(200).json({
    message: 'User successfully retrieved',
    data: user,
  });
}

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserVocabListSessions,
  getUserVocabListSession,
  getMe,
};
