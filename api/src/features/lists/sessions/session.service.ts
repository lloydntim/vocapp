import { BadRequestError } from '../../../errors/BadRequestError.js';
import { ConflictError } from '../../../errors/ConflictError.js';
import { PracticeSession } from '../../../generated/prisma/client.js';
import redisClient from '../../../redis/client.js';
import sessionRepository from './session.repository.js';

type StartSessionInput = Pick<PracticeSession, 'startedAt' | 'idempotencyKey'>;
type EndSessionInput = Pick<
  PracticeSession,
  'completedAt' | 'totalHints' | 'totalErrors' | 'totalSkipped'
>;

async function getSessionsByUserList(userId: string, listId: string): Promise<PracticeSession[]> {
  return sessionRepository.findPracticeSessionsByUserList(userId, listId);
}

async function getSessionByUserList(
  id: string,
  userId: string,
  listId: string,
): Promise<PracticeSession> {
  return sessionRepository.findPracticeSessionByUserList(id, userId, listId);
}

async function startSession(
  userId: string,
  listId: string,
  input: StartSessionInput,
): Promise<PracticeSession & { isExisting?: boolean }> {
  const { idempotencyKey } = input;
  if (!idempotencyKey) {
    throw new BadRequestError('Idempotency-Key header is required');
  }

  const cachedResponse = await redisClient.get(idempotencyKey);

  const isPending = cachedResponse === 'processing';

  if (isPending) {
    throw new ConflictError('Request is processing'); // status: 409
  }

  const newSession = cachedResponse ? JSON.parse(cachedResponse) : null;

  // if there's no cached response means session creation process needs to initiated first
  if (!cachedResponse) {
    await redisClient.set(idempotencyKey, 'processing', {
      condition: 'NX',
      expiration: { type: 'EX', value: 84600 },
    });
    const newSession = await sessionRepository.createPracticeSession(userId, listId, input); // => throws error if not successful

    // update the idempotency key with the new session response data and make sure it's unique, and expires after 24h
    await redisClient.set(idempotencyKey, JSON.stringify(newSession), {
      expiration: { type: 'EX', value: 84600 },
    });

    // after return the response to be used by the controller
    return newSession;
  }

  return {
    ...newSession,
    isExisting: true,
  };
}

async function endSession(
  sessionId: string,
  userId: string,
  listId: string,
  input: EndSessionInput,
): Promise<PracticeSession> {
  return sessionRepository.updatePracticeSession(sessionId, userId, listId, input);
}

export default {
  getSessionsByUserList,
  getSessionByUserList,
  startSession,
  endSession,
};
