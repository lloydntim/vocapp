import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { ForbiddenError } from '../../../errors/ForbiddenError.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import authenticate from '../../../middleware/authenticate.js';
import userRepository from '../user.repository.js';

vi.mock('../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: '01', email: 'jdoe@mail.com', role: 'user' };
    next();
  }),
}));

vi.mock('../user.repository.js', () => ({
  default: {
    getUsers: vi.fn(() => [
      { id: '01', first_name: 'John', email: 'jdoe@mail.com', role: 'admin', is_verified: true },
    ]),
    findUserById: vi.fn(),
  },
}));

describe('USER ROUTES', () => {
  describe('GET /users', async () => {
    it('returns users list', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toEqual(200);
    });

    it('throws error when user is not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new ForbiddenError('Not authenticated'));
      });
      const response = await request(app).get('/users');
      expect(response.status).toEqual(403);
    });

    it('throws error when no user data is can be retrieved', async () => {
      vi.mocked(authenticate).mockImplementationOnce((req, _res, next) => {
        req.user = { sub: '01', email: 'jdoe@mail.com', role: 'user' };
        next(new NotFoundError('Not found'));
      });
      const response = await request(app).get('/users');
      expect(response.status).toEqual(404);
    });
  });

  describe('GET /users/:userId', () => {
    it('returns user when found', async () => {
      vi.mocked(userRepository.findUserById).mockReturnValueOnce({
        id: '01',
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        role: 'admin',
      });

      const response = await request(app).get('/users/01');

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User successfully retrieved');
      expect(response.body.data).toMatchObject({ id: '01', email: 'jdoe@mail.com' });
    });

    it('returns 404 when user is not found', async () => {
      vi.mocked(userRepository.findUserById).mockReturnValueOnce(undefined as never);

      const response = await request(app).get('/users/99');

      expect(response.status).toEqual(404);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app).get('/users/01');

      expect(response.status).toEqual(401);
    });
  });
});
