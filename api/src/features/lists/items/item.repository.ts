import prisma from '../../../db/client.js';
import { VocabularyListItem } from '../../../generated/prisma/client.js';
import { handlePrismaError } from '../../../utils/handlePrismaError.js';

type UpdateVocabListItemInput = Pick<VocabularyListItem, 'position' | 'sourceText' | 'targetText'>;
type CreateVocabListItemInput = UpdateVocabListItemInput & { listId: string };

async function findVocabListItemsByListId(listId: string): Promise<VocabularyListItem[]> {
  return prisma.vocabularyListItem.findMany({ where: { listId } });
}

async function findVocabListItemByListId(itemId: string, listId: string): Promise<VocabularyListItem> {
  return handlePrismaError(prisma.vocabularyListItem.findUniqueOrThrow({ where: { id: itemId, listId } }), {
    P2025: 'Vocabulary List Item does not exist in this list',
  });
}

async function findVocabListItemById(itemId: string): Promise<VocabularyListItem> {
  return handlePrismaError(prisma.vocabularyListItem.findUniqueOrThrow({ where: { id: itemId } }), {
    P2025: 'Vocabulary List Item does not exist',
  });
}

async function addVocabListItem(input: CreateVocabListItemInput): Promise<VocabularyListItem> {
  return handlePrismaError(prisma.vocabularyListItem.create({ data: input }), {
    P2002: 'Vocabulary List Item could not be created',
  });
}

async function updateVocabListItem(
  itemId: string,
  data: UpdateVocabListItemInput,
): Promise<VocabularyListItem> {
  return handlePrismaError(prisma.vocabularyListItem.update({ where: { id: itemId }, data }), {
    P2025: 'Vocabulary List Item could not be updated',
  });
}

async function deleteVocabListItem(itemId: string): Promise<void> {
  await handlePrismaError(prisma.vocabularyListItem.delete({ where: { id: itemId } }), {
    P2025: 'Vocabulary List Item could not be deleted',
  });
}

export default {
  findVocabListItemsByListId,
  findVocabListItemById,
  findVocabListItemByListId,
  addVocabListItem,
  updateVocabListItem,
  deleteVocabListItem,
};
