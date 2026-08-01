import prisma from '../../../../db/client.js';
import type { PracticeResult, Prisma } from '../../../../generated/prisma/client.js';
import { handlePrismaError } from '../../../../utils/handlePrismaError.js';

type CreateResultInput = Omit<PracticeResult, 'createdAt'>;

async function findResultsBySessionId(sessionId: string): Promise<PracticeResult[]> {
  return prisma.practiceResult.findMany({ where: { sessionId } });
}

async function findResultBySessionId(id: string, sessionId: string): Promise<PracticeResult> {
  return handlePrismaError(prisma.practiceResult.findUniqueOrThrow({ where: { id, sessionId } }), {
    P2025: 'Practice Result does not exist for this Session',
  });
}

async function addResult(input: CreateResultInput): Promise<PracticeResult> {
  return handlePrismaError(prisma.practiceResult.create({ data: input }), {
    P2002: 'Practice Result could not be created',
  });
}

async function addResults(input: Prisma.PracticeResultCreateManyInput[]): Promise<void> {
  await handlePrismaError(prisma.practiceResult.createMany({ data: input, skipDuplicates: true }), {
    P2002: 'Practice Result could not be created',
  });
}

export default {
  findResultsBySessionId,
  findResultBySessionId,
  addResult,
  addResults,
};
