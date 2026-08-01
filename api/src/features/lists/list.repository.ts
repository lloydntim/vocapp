import prisma from '../../db/client.js';
import type { VocabularyList } from '../../generated/prisma/client.js';
import { handlePrismaError } from '../../utils/handlePrismaError.js';

type UpdateVocabListInput = {
  name?: string;
  sourceLanguageCode?: string;
  targetLanguageCode?: string;
};
type CreateVocabListInput = UpdateVocabListInput & {
  userId: string;
  name: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
};

async function getVocabLists(): Promise<VocabularyList[]> {
  return await prisma.vocabularyList.findMany();
}

async function getVocabListById(listId: string): Promise<VocabularyList> {
  return handlePrismaError(prisma.vocabularyList.findUniqueOrThrow({ where: { id: listId } }), {
    P2025: 'Vocabulary List does not exist',
  });
}

async function findVocabListsByUser(userId: string): Promise<VocabularyList[]> {
  const listsQuery = prisma.vocabularyList.findMany({ where: { userId } });
  const totalsQuery = prisma.vocabularyListItem.groupBy({
    by: ['listId'],
    where: {
      list: {
        userId,
      },
    },
    _count: {
      _all: true,
    },
    orderBy: { listId: 'asc' },
  });
  const masteredQuery = prisma.vocabularyListItem.groupBy({
    by: ['listId'],
    where: {
      list: {
        userId,
      },
      status: 'MASTERED',
    },
    _count: {
      _all: true,
    },
    orderBy: { listId: 'asc' },
  });

  const [lists, totals, mastered] = await prisma.$transaction([listsQuery, totalsQuery, masteredQuery]);

  const totalByList = new Map(totals.map((row) => [row.listId, row._count._all]));
  const masteredByList = new Map(mastered.map((row) => [row.listId, row._count._all]));

  return lists.map((list) => {
    const total = totalByList.get(list.id) ?? 0;
    const masteredCount = masteredByList.get(list.id) ?? 0;

    return {
      ...list,
      total,
      mastered: masteredCount,
      progress: total === 0 ? 0 : Math.round((masteredCount / total) * 100),
    };
  });
}

async function findVocabListByUser(
  listId: string,
  userId: string,
): Promise<VocabularyList & { progress: number; total: number; mastered: number }> {
  const [list, total, mastered] = await handlePrismaError(
    prisma.$transaction([
      prisma.vocabularyList.findUniqueOrThrow({ where: { id: listId, userId } }),
      prisma.vocabularyListItem.count({
        where: { listId },
      }),
      prisma.vocabularyListItem.count({
        where: {
          listId,
          status: 'MASTERED',
        },
      }),
    ]),
    {
      P2025: 'Vocabulary List for this User does not exist',
    },
  );
  return {
    ...list,
    total,
    mastered,
    progress: total === 0 ? 0 : (mastered / total) * 100,
  };
}

async function addVocabList(input: CreateVocabListInput): Promise<VocabularyList> {
  return handlePrismaError(prisma.vocabularyList.create({ data: input }), {
    P2002: 'Vocabulary List could not be created',
  });
}

async function updateVocabList(
  listId: string,
  data: UpdateVocabListInput,
): Promise<VocabularyList> {
  return handlePrismaError(prisma.vocabularyList.update({ where: { id: listId }, data }), {
    P2025: 'Vocabulary List could not be updated',
  });
}

async function deleteVocabList(listId: string): Promise<void> {
  await handlePrismaError(prisma.vocabularyList.delete({ where: { id: listId } }), {
    P2025: 'Vocabulary List could not be deleted',
  });
}

async function updateVocabListByUser(
  listId: string,
  userId: string,
  data: UpdateVocabListInput,
): Promise<VocabularyList> {
  return handlePrismaError(prisma.vocabularyList.update({ where: { id: listId, userId }, data }), {
    P2025: 'Vocabulary List for this User does not exist',
  });
}

async function deleteVocabListByUser(listId: string, userId: string): Promise<void> {
  await handlePrismaError(prisma.vocabularyList.delete({ where: { id: listId, userId } }), {
    P2025: 'Vocabulary List for this User does not exist',
  });
}

export default {
  getVocabLists,
  getVocabListById,
  addVocabList,
  updateVocabList,
  deleteVocabList,
  findVocabListsByUser,
  findVocabListByUser,
  updateVocabListByUser,
  deleteVocabListByUser,
};
