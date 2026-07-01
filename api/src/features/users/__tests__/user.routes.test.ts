import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { ForbiddenError } from '../../../errors/ForbiddenError.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import { UserPlan, UserRole } from '../../../generated/prisma/enums.js';
import authenticate from '../../../middleware/authenticate.js';
import listService from '../../lists/list.service.js';
import userRepository from '../user.repository.js';

vi.mock('../../../middleware/authorize.js', () => ({
  default: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock('../../../middleware/authorizeOwner.js', () => ({
  default: vi.fn((_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock('../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: '01', email: 'jdoe@mail.com', role: 'user' };
    next();
  }),
}));

vi.mock('../../lists/list.service.js', () => ({
  default: {
    addVocabList: vi.fn(),
  },
}));

vi.mock('../user.repository.js', () => ({
  default: {
    findUsers: vi
      .fn()
      .mockResolvedValue([
        { id: '01', firstName: 'John', email: 'jdoe@mail.com', role: 'USER', isVerified: true },
      ]),
    findUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}));

const USER_ID = '550e8400-e29b-41d4-a716-446655440001';
const USER_ID_NOT_FOUND = '550e8400-e29b-41d4-a716-446655440099';

describe('USER ROUTES', () => {
  describe('GET /users', async () => {
    it('returns users list', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toEqual(200);
    });

    it('throws error when user is not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new ForbiddenError('Not authenticated'));
      });
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toEqual(403);
    });

    it('throws error when no user data is can be retrieved', async () => {
      vi.mocked(authenticate).mockImplementationOnce((req, _res, next) => {
        req.user = { sub: '01', email: 'jdoe@mail.com', role: UserRole.USER };
        next(new NotFoundError('Not found'));
      });
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toEqual(404);
    });
  });

  describe('GET /users/me', () => {
    it('returns the authenticated user', async () => {
      vi.mocked(userRepository.findUserById).mockResolvedValueOnce({
        id: '01',
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@mail.com',
        username: 'jdoe',
        isVerified: true,
        role: 'USER',
        plan: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app).get('/api/v1/users/me');

      expect(response.status).toEqual(200);
      expect(response.body.data).toMatchObject({ id: '01', email: 'jdoe@mail.com' });
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).get('/api/v1/users/me');

      expect(response.status).toEqual(401);
    });

    it('returns 404 when user is not found', async () => {
      vi.mocked(userRepository.findUserById).mockRejectedValueOnce(
        new NotFoundError('User does not exist'),
      );

      const response = await request(app).get('/api/v1/users/me');

      expect(response.status).toEqual(404);
    });
  });

  describe('POST /users/:userId/lists', () => {
    const mockList = {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'French Vocabulary Notes',
      sourceLanguageId: null,
      targetLanguageId: null,
      sourceLanguageCode: 'en',
      targetLanguageCode: 'fr',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('returns 201 with the created list', async () => {
      vi.mocked(authenticate).mockImplementationOnce((req, _res, next) => {
        req.user = { id: mockList.userId, sub: mockList.userId, email: 'jdoe@mail.com', role: 'USER' };
        next();
      });
      vi.mocked(listService.addVocabList).mockResolvedValueOnce(mockList);

      const response = await request(app)
        .post(`/api/v1/users/${mockList.userId}/lists`)
        .send({ name: 'French Vocabulary Notes', sourceLanguageCode: 'en', targetLanguageCode: 'fr' });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Vocabulary List has been created successfully');
      expect(response.body.data).toMatchObject({ id: mockList.id, name: mockList.name });
    });

    it('returns 400 when required fields are missing', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${mockList.userId}/lists`)
        .send({ name: 'French Vocabulary Notes' });

      expect(response.status).toEqual(400);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).post(`/api/v1/users/${mockList.userId}/lists`);

      expect(response.status).toEqual(401);
    });
  });

  describe('PATCH /users/:userId', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const updatedUser = {
      id: userId,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jdoe@mail.com',
      username: 'jdoe',
      isVerified: true,
      role: UserRole.USER,
      plan: UserPlan.FREE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('returns 200 with the updated user', async () => {
      vi.mocked(userRepository.updateUser).mockResolvedValueOnce(updatedUser);

      const response = await request(app)
        .patch(`/api/v1/users/${userId}`)
        .send({ firstName: 'Jane' });

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User Account has been updated successfully');
      expect(response.body.data).toMatchObject({ id: userId, firstName: 'Jane' });
      expect(vi.mocked(userRepository.updateUser)).toHaveBeenCalledWith(userId, { firstName: 'Jane' });
    });

    it('returns 400 when body contains invalid data', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${userId}`)
        .send({ email: 'not-an-email' });

      expect(response.status).toEqual(400);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).patch(`/api/v1/users/${userId}`).send({ firstName: 'Jane' });

      expect(response.status).toEqual(401);
    });

    it('returns 404 when user is not found', async () => {
      vi.mocked(userRepository.updateUser).mockRejectedValueOnce(
        new NotFoundError('User does not exist'),
      );

      const response = await request(app).patch(`/api/v1/users/${userId}`).send({ firstName: 'Jane' });

      expect(response.status).toEqual(404);
    });
  });

  describe('GET /users/:userId', () => {
    it('returns user when found', async () => {
      vi.mocked(userRepository.findUserById).mockResolvedValueOnce({
        id: USER_ID,
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@mail.com',
        username: 'jdoe',
        isVerified: true,
        role: 'ADMIN',
        plan: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app).get(`/api/v1/users/${USER_ID}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User successfully retrieved');
      expect(response.body.data).toMatchObject({ id: USER_ID, email: 'jdoe@mail.com' });
    });

    it('returns 404 when user is not found', async () => {
      vi.mocked(userRepository.findUserById).mockRejectedValueOnce(
        new NotFoundError('User does not exist'),
      );

      const response = await request(app).get(`/api/v1/users/${USER_ID_NOT_FOUND}`);

      expect(response.status).toEqual(404);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).get(`/api/v1/users/${USER_ID}`);

      expect(response.status).toEqual(401);
    });
  });
});
