import type { VocabularyList } from '../../generated/prisma/client.js';
import listRepository from './list.repository.js';

type VocabListInput = {
  name: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
};

async function getVocabLists() {
  const vocabLists = await listRepository.getVocabLists();

  return vocabLists;
}

async function getVocabListById(id: string): Promise<VocabularyList> {
  const vocabList = await listRepository.getVocabListById(id);
  return vocabList;
}

async function getVocabListsByUser(userId: string): Promise<VocabularyList[]> {
  const userVocabLists = await listRepository.findVocabListsByUser(userId);

  return userVocabLists;
}

async function getVocabListByUser(id: string, userId: string): Promise<VocabularyList> {
  const vocabList = await listRepository.findVocabListByUser(id, userId);
  return vocabList;
}

async function addVocabList(userId: string, input: VocabListInput) {
  const newVocabList = await listRepository.addVocabList({ ...input, userId });

  return newVocabList;
}

async function updateVocabList(id: string, input: VocabListInput) {
  const newVocabList = await listRepository.updateVocabList(id, input);

  return newVocabList;
}

async function deleteVocabList(id: string) {
  await listRepository.deleteVocabList(id);
}

async function updateVocabListByUser(id: string, userId: string, input: VocabListInput) {
  return listRepository.updateVocabListByUser(id, userId, input);
}

async function deleteVocabListByUser(id: string, userId: string) {
  await listRepository.deleteVocabListByUser(id, userId);
}

export default {
  getVocabLists,
  getVocabListById,
  getVocabListsByUser,
  getVocabListByUser,
  addVocabList,
  updateVocabList,
  deleteVocabList,
  updateVocabListByUser,
  deleteVocabListByUser,
};
