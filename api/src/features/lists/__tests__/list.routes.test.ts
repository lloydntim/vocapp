import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { ConflictError } from '../../../errors/ConflictError.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import authenticate from '../../../middleware/authenticate.js';
import listService from '../list.service.js';

vi.mock('../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: '01', email: 'jdoe@mail.com', role: 'ADMIN' };
    next();
  }),
}));

vi.mock('../../../middleware/authorize.js', () => ({
  default: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock('../list.service.js', () => ({
  default: {
    getVocabLists: vi.fn(),
    getVocabListById: vi.fn(),
    addVocabList: vi.fn(),
    updateVocabList: vi.fn(),
    deleteVocabList: vi.fn(),
  },
}));

const mockList = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  userId: '01',
  name: 'German Basics',
  sourceLanguageId: null,
  targetLanguageId: null,
  sourceLanguageCode: 'en',
  targetLanguageCode: 'de',
  lastPracticed: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('LIST ROUTES', () => {
  describe('GET /lists', () => {
    it('returns 200 with list data', async () => {
      vi.mocked(listService.getVocabLists).mockResolvedValueOnce([mockList]);

      const response = await request(app).get('/api/v1/lists');

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Vocabulary lists have been retrieved successfully');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({ id: mockList.id, name: mockList.name });
    });

    it('returns 200 with empty array when no lists exist', async () => {
      vi.mocked(listService.getVocabLists).mockResolvedValueOnce([]);

      const response = await request(app).get('/api/v1/lists');

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([]);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).get('/api/v1/lists');

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /lists/:listId', () => {
    it('returns 200 with list data', async () => {
      vi.mocked(listService.getVocabListById).mockResolvedValueOnce(mockList);

      const response = await request(app).get(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Vocabulary List successfully retrieved');
      expect(response.body.data).toMatchObject({ id: mockList.id, name: mockList.name });
    });

    it('returns 404 when list not found', async () => {
      vi.mocked(listService.getVocabListById).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List does not exist'),
      );

      const response = await request(app).get(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Vocabulary List does not exist');
      expect(response.body.code).toEqual('NOT_FOUND');
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).get(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(401);
    });
  });

  describe('POST /lists', () => {
    it('returns 200 with list data', async () => {
      vi.mocked(listService.addVocabList).mockResolvedValueOnce(mockList);

      const response = await request(app).post('/api/v1/lists').send({
        name: 'Spanish Basics',
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
      });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Vocabulary List has been created successfully');
      expect(response.body.data).toMatchObject({ id: mockList.id, name: mockList.name });
    });

    it('returns 409 when list already exists', async () => {
      vi.mocked(listService.addVocabList).mockRejectedValueOnce(
        new ConflictError('Vocabulary List could not be created'),
      );

      const response = await request(app).post('/api/v1/lists').send({
        name: 'Spanish Basics',
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
      });

      expect(response.status).toEqual(409);
      expect(response.body.message).toEqual('Vocabulary List could not be created');
      expect(response.body.code).toEqual('CONFLICT');
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).post('/api/v1/lists');

      expect(response.status).toEqual(401);
    });
  });

  describe('PATCH /lists/:listId', () => {
    it('returns 200 with list data', async () => {
      vi.mocked(listService.updateVocabList).mockResolvedValueOnce({
        ...mockList,
        name: 'Updated Name',
      });

      const response = await request(app).patch(`/api/v1/lists/${mockList.id}`).send({
        name: 'Updated Name',
      });

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Vocabulary List has been updated successfully');
      expect(response.body.data).toMatchObject({ id: mockList.id, name: 'Updated Name' });
    });

    it('returns 404 when list not found', async () => {
      vi.mocked(listService.updateVocabList).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List does not exist'),
      );

      const response = await request(app).patch(`/api/v1/lists/${mockList.id}`).send({
        name: 'Updated Name',
      });

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Vocabulary List does not exist');
      expect(response.body.code).toEqual('NOT_FOUND');
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).patch(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(401);
    });
  });

  describe('DELETE /lists/:listId', () => {
    it('returns 204 when deleted successfully', async () => {
      vi.mocked(listService.deleteVocabList).mockResolvedValueOnce(undefined);

      const response = await request(app).delete(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(204);
    });

    it('returns 404 when list not found', async () => {
      vi.mocked(listService.deleteVocabList).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List does not exist'),
      );

      const response = await request(app).delete(`/api/v1/lists/${mockList.id}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Vocabulary List does not exist');
      expect(response.body.code).toEqual('NOT_FOUND');
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).delete('/api/v1/lists/01');

      expect(response.status).toEqual(401);
    });
  });
});
