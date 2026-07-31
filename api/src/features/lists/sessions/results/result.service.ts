import { BadRequestError } from '../../../../errors/BadRequestError.js';
import type { PracticeResult } from '../../../../generated/prisma/client.js';
import itemRepository from '../../items/item.repository.js';
import sessionRepository from '../session.repository.js';
import resultRepository from './result.repository.js';
import type { AddResultInput } from './result.schema.js';

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

async function addResults(
  userId: string,
  listId: string,
  sessionId: string,
  input: AddResultInput[],
): Promise<void> {
  const session = await sessionRepository.findPracticeSessionByUserList(sessionId, userId, listId);

  const validItems = await itemRepository.findVocabListItemsByListId(listId);
  const validIds = new Set(validItems.map((item) => item.id));
  const itemIds = input.map((item) => item.itemId);
  const invalid = itemIds.filter((id) => !validIds.has(id));

  if (invalid.length > 0) {
    throw new BadRequestError(`Invalid item ids: ${invalid.join(', ')}`);
  }

  const results = input.map((item) => ({
    ...item,
    sessionId: session.id,
    completedAt: item.completedAt ?? null,
    hints: item.hints ?? 0,
    errors: item.errors ?? 0,
    skipped: item.skipped ?? false,
  }));

  await resultRepository.addResults(results);
}

export default {
  getResultsByUserListSession,
  getResultByUserListSession,
  addResults,
};
