import type { Request, Response } from 'express';
import logger from '../../../config/logger.js';
import type { PracticeSession } from '../../../generated/prisma/client.js';
import sessionService from './session.service.js';

type SessionResponse = {
  message: string;
  data?: PracticeSession | PracticeSession[];
};

async function getSessionsByUserList(
  req: Request<{ userId: string; listId: string }, SessionResponse>,
  res: Response<SessionResponse>,
) {
  const { userId, listId } = req.params;
  const sessions = await sessionService.getSessionsByUserList(userId, listId);

  return res.status(200).json({
    message: 'Practice sessions retrieved successfully',
    data: sessions,
  });
}

async function getSessionByUserList(
  req: Request<{ userId: string; listId: string; id: string }, SessionResponse>,
  res: Response<SessionResponse>,
) {
  const { userId, listId, id } = req.params;
  const session = await sessionService.getSessionByUserList(id, userId, listId);

  return res.status(200).json({
    message: 'Practice session retrieved successfully',
    data: session,
  });
}

async function startSession(
  req: Request<{ userId: string; listId: string }>,
  res: Response<SessionResponse>,
) {
  const { userId, listId } = req.params;
  const idempotencyKey = req.headers['idempotency-key'];

  const session = await sessionService.startSession(userId, listId, {
    ...req.body,
    idempotencyKey,
  });

  if (session.isExisting) {
    logger.info({ userId, listId }, 'Practice session retrieved');

    return res.status(200).json({
      message: 'Practice retrieved successfully',
      data: session,
    });
  }

  logger.info({ userId, listId }, 'Practice session created');

  return res.status(201).json({
    message: 'Practice session created successfully',
    data: session,
  });
}

async function endSession(
  req: Request<{ userId: string; listId: string; sessionId: string }>,
  res: Response<SessionResponse>,
) {
  const { userId, listId, sessionId } = req.params;
  const session = await sessionService.endSession(sessionId, userId, listId, req.body);

  logger.info({ sessionId, userId, listId }, 'Practice session ended');

  return res.status(200).json({
    message: 'Practice session ended successfully',
    data: session,
  });
}

export default {
  getSessionsByUserList,
  getSessionByUserList,
  startSession,
  endSession,
};
