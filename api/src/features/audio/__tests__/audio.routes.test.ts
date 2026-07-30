import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import { VocabularyItemStatus } from '../../../generated/prisma/enums.js';
import authenticate from '../../../middleware/authenticate.js';
import listItemRepository from '../../lists/items/item.repository.js';
import listRepository from '../../lists/list.repository.js';
import audioService from '../audio.service.js';

vi.mock('../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: 'user-id-001', email: 'jdoe@mail.com', role: 'USER' };
    next();
  }),
}));

vi.mock('../../lists/list.repository.js', () => ({
  default: { findVocabListByUser: vi.fn() },
}));

vi.mock('../../lists/items/item.repository.js', () => ({
  default: { findVocabListItemByListId: vi.fn() },
}));

vi.mock('../audio.service.js', () => ({
  default: { getOrCreateAudioUrl: vi.fn() },
}));

const USER_ID = '660e8400-e29b-41d4-a716-446655440000';
const LIST_ID = '660e8400-e29b-41d4-a716-446655440001';
const ITEM_ID = '660e8400-e29b-41d4-a716-446655440002';

const mockList = {
  id: LIST_ID,
  userId: USER_ID,
  name: 'Test List',
  sourceLanguageId: null,
  targetLanguageId: null,
  sourceLanguageCode: 'en',
  targetLanguageCode: 'de',
  lastPracticed: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  total: 0,
  mastered: 0,
  progress: 0,
};

const mockItem = {
  id: ITEM_ID,
  listId: LIST_ID,
  sourceText: 'apple',
  targetText: 'Apfel',
  position: 1,
  status: VocabularyItemStatus.LEARNING,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAudio = {
  audioKey: 'audio/en/deadbeef.mp3',
  audioUrl: 'https://signed-url.example/audio.mp3',
};

const asOwner = () =>
  vi.mocked(authenticate).mockImplementationOnce((req, _res, next) => {
    req.user = { sub: USER_ID, email: 'jdoe@mail.com', role: 'USER' };
    next();
  });

describe('GET /users/:userId/lists/:listId/items/:itemId/audio', () => {
  it('returns 200 with the source audio clip', async () => {
    asOwner();
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockResolvedValueOnce(mockItem);
    vi.mocked(audioService.getOrCreateAudioUrl).mockResolvedValueOnce(mockAudio);

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'source' });

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Audio clip retrieved successfully');
    expect(response.body.data).toEqual(mockAudio);
    expect(audioService.getOrCreateAudioUrl).toHaveBeenCalledWith(
      mockItem.sourceText,
      mockList.sourceLanguageCode,
    );
  });

  it('returns 200 with the target audio clip', async () => {
    asOwner();
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockResolvedValueOnce(mockItem);
    vi.mocked(audioService.getOrCreateAudioUrl).mockResolvedValueOnce(mockAudio);

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'target' });

    expect(response.status).toEqual(200);
    expect(audioService.getOrCreateAudioUrl).toHaveBeenCalledWith(
      mockItem.targetText,
      mockList.targetLanguageCode,
    );
  });

  it('returns 400 when field is missing', async () => {
    asOwner();

    const response = await request(app).get(
      `/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`,
    );

    expect(response.status).toEqual(400);
  });

  it('returns 400 when field is not "source" or "target"', async () => {
    asOwner();

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'both' });

    expect(response.status).toEqual(400);
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
      next(new UnauthorizedError('No token provided'));
    });

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'source' });

    expect(response.status).toEqual(401);
  });

  it('returns 403 when the authenticated user does not own the resource', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'source' });

    expect(response.status).toEqual(403);
  });

  it('returns 404 when the list is not found', async () => {
    asOwner();
    vi.mocked(listRepository.findVocabListByUser).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List for this User does not exist'),
    );

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'source' });

    expect(response.status).toEqual(404);
  });

  it('returns 404 when the item is not found in the list', async () => {
    asOwner();
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List Item does not exist in this list'),
    );

    const response = await request(app)
      .get(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items/${ITEM_ID}/audio`)
      .query({ field: 'target' });

    expect(response.status).toEqual(404);
  });
});
