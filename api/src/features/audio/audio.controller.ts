import { Request, Response } from 'express';
import listItemRepository from '../lists/items/item.repository.js';
import listRepository from '../lists/list.repository.js';
import type { GetItemAudioQuery } from './audio.schema.js';
import audioService from './audio.service.js';

type AudioResponse = { message: string; data: { audioUrl: string; audioKey: string } };

async function getVocabListItemAudio(
  req: Request<
    { userId: string; listId: string; itemId: string },
    AudioResponse,
    unknown,
    GetItemAudioQuery
  >,
  res: Response<AudioResponse>,
) {
  const { userId, listId, itemId } = req.params;
  const { field } = req.query;

  const list = await listRepository.findVocabListByUser(listId, userId);
  const item = await listItemRepository.findVocabListItemByListId(itemId, list.id);

  const text = field === 'source' ? item.sourceText : item.targetText;
  const languageCode = field === 'source' ? list.sourceLanguageCode : list.targetLanguageCode;

  const { audioUrl, audioKey } = await audioService.getOrCreateAudioUrl(text, languageCode);

  res
    .status(200)
    .json({ message: 'Audio clip retrieved successfully', data: { audioUrl, audioKey } });
}

export default { getVocabListItemAudio };
