import prisma from '../../db/client.js';
import { VocabularyList } from '../../generated/prisma/client.js';
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
  return prisma.vocabularyList.findMany({ where: { userId } });
}

async function findVocabListByUser(listId: string, userId: string): Promise<VocabularyList> {
  return handlePrismaError(
    prisma.vocabularyList.findUniqueOrThrow({ where: { id: listId, userId } }),
    {
      P2025: 'Vocabulary List for this User does not exist',
    },
  );
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
