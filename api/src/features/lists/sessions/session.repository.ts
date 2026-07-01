import prisma from '../../../db/client.js';
import { PracticeSession } from '../../../generated/prisma/client.js';
import { handlePrismaError } from '../../../utils/handlePrismaError.js';

type CreateSessionInput = Pick<PracticeSession, 'userId' | 'listId' | 'startedAt'>;
type EndSessionInput = Pick<
  PracticeSession,
  'completedAt' | 'totalHints' | 'totalErrors' | 'totalSkipped'
>;

async function findPracticeSessionsByUserList(
  userId: string,
  listId: string,
): Promise<PracticeSession[]> {
  return prisma.practiceSession.findMany({ where: { userId, listId } });
}

async function findPracticeSessionByUserList(
  id: string,
  userId: string,
  listId: string,
): Promise<PracticeSession> {
  return handlePrismaError(
    prisma.practiceSession.findUniqueOrThrow({ where: { id, userId, listId } }),
    { P2025: 'Practice Session does not exist for this User and List' },
  );
}

async function addPracticeSession(input: CreateSessionInput): Promise<PracticeSession> {
  return handlePrismaError(prisma.practiceSession.create({ data: input }), {
    P2002: 'Practice Session could not be created',
  });
}

async function updatePracticeSession(
  id: string,
  userId: string,
  listId: string,
  input: EndSessionInput,
): Promise<PracticeSession> {
  return handlePrismaError(
    prisma.practiceSession.update({ where: { id, userId, listId }, data: input }),
    { P2025: 'Practice Session does not exist for this User and List' },
  );
}

export default {
  findPracticeSessionsByUserList,
  findPracticeSessionByUserList,
  addPracticeSession,
  updatePracticeSession,
};
