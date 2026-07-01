import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../../app.js';
import { NotFoundError } from '../../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../../errors/UnauthorizedError.js';
import authenticate from '../../../../middleware/authenticate.js';
import listItemService from '../item.service.js';

vi.mock('../../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: 'user-id-001', email: 'jdoe@mail.com', role: 'USER' };
    next();
  }),
}));

vi.mock('../../../../middleware/authorize.js', () => ({
  default: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock('../item.service.js', () => ({
  default: {
    getVocabListItems: vi.fn(),
    getVocabListItemsByUserList: vi.fn(),
    getVocabListItemByUserList: vi.fn(),
    addVocabListItem: vi.fn(),
  },
}));

const USER_ID = '660e8400-e29b-41d4-a716-446655440000';
const LIST_ID = '660e8400-e29b-41d4-a716-446655440001';

const mockItem = {
  id: 'item-id-001',
  listId: LIST_ID,
  sourceText: 'apple',
  targetText: 'Apfel',
  position: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ITEM ROUTES', () => {
  describe('POST /users/:userId/lists/:listId/items', () => {
    it('returns 201 with the created item', async () => {
      vi.mocked(listItemService.addVocabListItem).mockResolvedValueOnce(mockItem);

      const response = await request(app)
        .post(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Vocabulary list item added successfully');
      expect(response.body.data).toMatchObject({ id: mockItem.id, sourceText: 'apple' });
    });

    it('returns 400 when sourceText is missing', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ targetText: 'Apfel' });

      expect(response.status).toEqual(400);
    });

    it('returns 400 when targetText is missing', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple' });

      expect(response.status).toEqual(400);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app)
        .post(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(401);
    });

    it('returns 404 when list is not found', async () => {
      vi.mocked(listItemService.addVocabListItem).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List for this User does not exist'),
      );

      const response = await request(app)
        .post(`/api/v1/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(404);
    });
  });

  describe('GET /users/:userId/lists/:listId/items/:itemId', () => {
    it('returns 201 with the created item', async () => {
      vi.mocked(listItemService.getVocabListItemByUserList).mockResolvedValueOnce(mockItem);
    });

    it('returns 404 when item is not found', async () => {
      vi.mocked(listItemService.getVocabListItemByUserList).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List Item for this User does not exist'),
      );
    });
  });
});
