import { PracticeSession } from '../../../generated/prisma/client.js';
import sessionRepository from './session.repository.js';

type StartSessionInput = Pick<PracticeSession, 'startedAt'>;
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
): Promise<PracticeSession> {
  return sessionRepository.addPracticeSession({ ...input, userId, listId });
}

async function endSession(
  id: string,
  userId: string,
  listId: string,
  input: EndSessionInput,
): Promise<PracticeSession> {
  return sessionRepository.updatePracticeSession(id, userId, listId, input);
}

export default {
  getSessionsByUserList,
  getSessionByUserList,
  startSession,
  endSession,
};
