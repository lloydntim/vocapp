import type { Request, Response } from 'express';
import logger from '../../../config/logger.js';
import type { VocabularyListItem } from '../../../generated/prisma/client.js';
import listItemRepository from './item.repository.js';
import listItemService from './item.service.js';

type VocabListItemResponse = {
  message: string;
  data: VocabularyListItem | VocabularyListItem[];
};

async function getVocabListItems(listId: string) {
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(listId);

  return vocabListItems;
}

async function getVocabListItemsByUserList(
  req: Request<{ userId: string; listId: string }, VocabListItemResponse>,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId } = req.params;
  const vocabListItems = await listItemService.getVocabListItemsByUserList(userId, listId);

  res.status(200).json({
    message: 'Vocab List Items retrieved successfully',
    data: vocabListItems,
  });
}

async function getVocabListItemByUserList(
  req: Request<{ userId: string; listId: string; itemId: string }, VocabListItemResponse>,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId, itemId } = req.params;
  const vocabListItem = await listItemService.getVocabListItemByUserList(userId, listId, itemId);

  res.status(200).json({
    message: 'Vocab List Items retrieved successfully',
    data: vocabListItem,
  });
}

async function addVocabListItem(
  req: Request<
    { userId: string; listId: string },
    VocabListItemResponse,
    { sourceText: string; targetText: string }
  >,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId } = req.params;
  const { sourceText, targetText } = req.body;
  const item = await listItemService.addVocabListItem(userId, listId, { sourceText, targetText });

  res.status(201).json({
    message: 'Vocabulary list item added successfully',
    data: item,
  });
}

async function updateVocabListItemStatus(
  req: Request<
    { userId: string; listId: string; itemId: string },
    VocabListItemResponse,
    { status: 'LEARNING' | 'MASTERED' }
  >,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId, itemId } = req.params;
  const { status } = req.body;
  const updatedItem = await listItemService.updateVocabListItemStatus(
    userId,
    listId,
    itemId,
    status,
  );

  res.status(200).json({
    message: 'Vocabulary list item status updated successfully',
    data: updatedItem,
  });
}

async function deleteVocabListItem(
  req: Request<
    { userId: string; listId: string; itemId: string },
    VocabListItemResponse,
    { sourceText: string; targetText: string }
  >,
  res: Response<VocabListItemResponse>,
) {
  const { itemId } = req.params;

  await listItemService.deleteVocabListItem(itemId);

  logger.info({ listItemId: itemId }, 'Vocabulary List Item deleted');

  res.status(204).send();
}

export default {
  getVocabListItems,
  getVocabListItemsByUserList,
  getVocabListItemByUserList,
  addVocabListItem,
  updateVocabListItemStatus,
  deleteVocabListItem,
};
