import type { Request, Response } from 'express';
import logger from '../../../../config/logger.js';
import type { PracticeResult } from '../../../../generated/prisma/client.js';
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

async function addResults(
  req: Request<{ userId: string; listId: string; sessionId: string }>,
  res: Response<ResultResponse>,
) {
  const { userId, listId, sessionId } = req.params;

  await resultService.addResults(userId, listId, sessionId, req.body.results);

  logger.info({ userId, listId, sessionId }, 'Practice results created');

  return res.status(201).json({
    message: 'Practice results created successfully',
  });
}

export default {
  getResultsByUserListSession,
  getResultByUserListSession,
  addResults,
};
