import logger from '../../../config/logger.js';
import { VocabularyListItem } from '../../../generated/prisma/client.js';
import listRepository from '../list.repository.js';
import listItemRepository from './item.repository.js';
import type { AddItemInput } from './item.schema.js';

async function getVocabListItems(listId: string) {
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(listId);

  return vocabListItems;
}

async function getVocabListItemsByUserList(
  userId: string,
  listId: string,
): Promise<VocabularyListItem[]> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(vocabList.id);

  return vocabListItems;
}

async function getVocabListItemByUserList(
  userId: string,
  listId: string,
  listItemId: string,
): Promise<VocabularyListItem> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);
  const vocabListItem = await listItemRepository.findVocabListItemByListId(
    listItemId,
    vocabList.id,
  );

  return vocabListItem;
}

async function addVocabListItem(
  userId: string,
  listId: string,
  data: AddItemInput,
): Promise<VocabularyListItem> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);
  const existingItems = await listItemRepository.findVocabListItemsByListId(vocabList.id);
  const position = existingItems.length + 1;

  logger.info({ listId, userId }, 'Added list');

  return listItemRepository.addVocabListItem({
    listId: vocabList.id,
    sourceText: data.sourceText,
    targetText: data.targetText,
    position,
  });
}

async function deleteVocabListItem(id: string) {
  await listItemRepository.deleteVocabListItem(id);
}

export default {
  getVocabListItems,
  getVocabListItemsByUserList,
  getVocabListItemByUserList,
  addVocabListItem,
  deleteVocabListItem,
};
