import { PracticeResult } from '../../../../generated/prisma/client.js';
import sessionRepository from '../session.repository.js';
import resultRepository from './result.repository.js';

type CreateResultInput = Pick<PracticeResult, 'sourceText' | 'targetText' | 'startedAt'> &
  Partial<Pick<PracticeResult, 'itemId' | 'completedAt' | 'hints' | 'errors' | 'skipped'>>;

async function getResultsByUserListSession(
  userId: string,
  listId: string,
  sessionId: string,
): Promise<PracticeResult[]> {
  await sessionRepository.findPracticeSessionByUserList(sessionId, userId, listId);
  return resultRepository.findResultsBySessionId(sessionId);
}

async function getResultByUserListSession(
  id: string,
  userId: string,
  listId: string,
  sessionId: string,
): Promise<PracticeResult> {
  await sessionRepository.findPracticeSessionByUserList(sessionId, userId, listId);
  return resultRepository.findResultBySessionId(id, sessionId);
}

async function addResult(
  userId: string,
  listId: string,
  sessionId: string,
  input: CreateResultInput,
): Promise<PracticeResult> {
  await sessionRepository.findPracticeSessionByUserList(sessionId, userId, listId);
  return resultRepository.addResult({ ...input, sessionId });
}

export default {
  getResultsByUserListSession,
  getResultByUserListSession,
  addResult,
};
