import type { Request, Response } from 'express';
import logger from '../../config/logger.js';
import type { VocabularyList } from '../../generated/prisma/client.js';
import type { NoParams } from '../../shared/types/index.js';
import listService from './list.service.js';

export interface VocabListResponse {
  data?: VocabularyList | VocabularyList[];
  message?: string;
}

export async function getVocabLists(
  _req: Request<NoParams, VocabListResponse>,
  res: Response<VocabListResponse>,
) {
  const vocabLists = await listService.getVocabLists();

  res
    .status(200)
    .json({ message: 'Vocabulary lists have been retrieved successfully', data: vocabLists });
}
export async function getVocabListById(
  req: Request<{ listId: string }, VocabListResponse>,
  res: Response<VocabListResponse>,
) {
  const vocabList = await listService.getVocabListById(req.params.listId);

  return res.status(200).json({
    message: 'Vocabulary List successfully retrieved',
    data: vocabList,
  });
}

async function getVocabListsByUser(
  req: Request<{ userId: string }, VocabListResponse>,
  res: Response<VocabListResponse>,
) {
  const userVocabLists = await listService.getVocabListsByUser(req.params.userId);

  return res.status(200).json({
    message: 'User Vocabulary Lists successfully retrieved',
    data: userVocabLists,
  });
}

async function getVocabListByUser(
  req: Request<{ userId: string; listId: string }, VocabListResponse>,
  res: Response<VocabListResponse>,
) {
  const userVocabList = await listService.getVocabListByUser(req.params.listId, req.params.userId);

  return res.status(200).json({
    message: 'User Vocabulary List successfully retrieved',
    data: userVocabList,
  });
}

export async function addVocabList(req: Request, res: Response<VocabListResponse>) {
  const userId = req.user.sub!;
  const newVocabList = await listService.addVocabList(userId, req.body);

  logger.info({ userId }, 'Vocabulary list created');

  res.status(201).json({
    data: newVocabList,
    message: 'Vocabulary List has been created successfully',
  });
}
export async function updateVocabList(
  req: Request<{ listId: string }>,
  res: Response<VocabListResponse>,
) {
  const updatedVocabList = await listService.updateVocabList(req.params.listId, req.body);

  logger.info({ listId: req.params.listId }, 'Vocabulary list updated');

  res.status(200).json({
    data: updatedVocabList,
    message: 'Vocabulary List has been updated successfully',
  });
}
export async function deleteVocabList(
  req: Request<{ listId: string }>,
  res: Response<VocabListResponse>,
) {
  await listService.deleteVocabList(req.params.listId);

  logger.info({ listId: req.params.listId }, 'Vocabulary list deleted');

  res.status(204).send();
}
export async function updateVocabListByUser(
  req: Request<{ listId: string }>,
  res: Response<VocabListResponse>,
) {
  const updatedVocabList = await listService.updateVocabListByUser(
    req.params.listId,
    req.user.id,
    req.body,
  );

  logger.info(
    { listId: req.params.listId, userId: req.user.id },
    'Vocabulary list for this User updated',
  );

  res.status(200).json({
    data: updatedVocabList,
    message: 'Vocabulary List for this User has been updated successfully',
  });
}
export async function deleteVocabListByUser(
  req: Request<{ listId: string }>,
  res: Response<VocabListResponse>,
) {
  await listService.deleteVocabListByUser(req.params.listId, req.user.id);

  logger.info({ listId: req.params.listId, userId: req.user.id }, 'Vocabulary list deleted');

  res.status(204).send();
}

export default {
  getVocabLists,
  getVocabListsByUser,
  getVocabListById,
  getVocabListByUser,
  addVocabList,
  updateVocabList,
  deleteVocabList,
  updateVocabListByUser,
  deleteVocabListByUser,
};
