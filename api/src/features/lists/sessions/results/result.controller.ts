import type { Request, Response } from 'express';
import logger from '../../../../config/logger.js';
import { PracticeResult } from '../../../../generated/prisma/client.js';
import resultService from './result.service.js';

type ResultResponse = {
  message: string;
  data?: PracticeResult | PracticeResult[];
};

async function getResultsByUserListSession(
  req: Request<{ userId: string; listId: string; sessionId: string }, ResultResponse>,
  res: Response<ResultResponse>,
) {
  const { userId, listId, sessionId } = req.params;
  const results = await resultService.getResultsByUserListSession(userId, listId, sessionId);

  return res.status(200).json({
    message: 'Practice results retrieved successfully',
    data: results,
  });
}

async function getResultByUserListSession(
  req: Request<{ userId: string; listId: string; sessionId: string; id: string }, ResultResponse>,
  res: Response<ResultResponse>,
) {
  const { userId, listId, sessionId, id } = req.params;
  const result = await resultService.getResultByUserListSession(id, userId, listId, sessionId);

  return res.status(200).json({
    message: 'Practice result retrieved successfully',
    data: result,
  });
}

async function addResult(
  req: Request<{ userId: string; listId: string; sessionId: string }>,
  res: Response<ResultResponse>,
) {
  const { userId, listId, sessionId } = req.params;
  const result = await resultService.addResult(userId, listId, sessionId, req.body);

  logger.info({ userId, listId, sessionId }, 'Practice result added');

  return res.status(201).json({
    message: 'Practice result added successfully',
    data: result,
  });
}

export default {
  getResultsByUserListSession,
  getResultByUserListSession,
  addResult,
};
