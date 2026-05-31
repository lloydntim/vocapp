import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import { loginUser, registerUser } from '../auth.service.js';

vi.mock('../auth.service.js', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

describe('AUTH ROUTES', () => {
  describe('POST /login', async () => {
    it('returns ok when login successful', async () => {
      vi.mocked(loginUser).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        userData: {
          id: '02',
          first_name: 'Joe',
          last_name: 'Bloggs',
          email: 'jbloggs@mail.com',
          username: 'jbloggs',
          is_verified: false,
          role: 'user',
        },
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'jbloggs', password: 'secret1' });

      const setCookieHeader = response.headers['set-cookie'];
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [];

      const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Secure');
      expect(refreshTokenCookie).toContain('SameSite=Strict');

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User is logged in');
      expect(response.body.accessToken).toEqual('access-token');
      expect(response.body.data.is_verified).toBeFalsy();
    });

    it('throws an error when login details are missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: '', password: 'secret1' });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Form fields are incomplete');
    });

    it('throws an error when user name or password is wrong', async () => {
      vi.mocked(loginUser).mockRejectedValue(
        new UnauthorizedError('Wrong username or password, please try again'),
      );
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'username1', password: 'wrongpassword' });

      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Wrong username or password, please try again');
    });
  });

  describe('POST /register', async () => {
    it('returns ok when registration successful', async () => {
      vi.mocked(registerUser).mockResolvedValue({
        userData: {
          id: '02',
          first_name: 'Joe',
          last_name: 'Bloggs',
          email: 'jbloggs@mail.com',
          username: 'jbloggs',
          is_verified: false,
          role: 'user',
        },
      });
      const response = await request(app).post('/auth/register').send({
        username: 'jbloggs',
        password: 'secret1',
        email: 'me@mail.com',
        lastName: 'Bloggs',
        firstName: 'Joe',
      });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('User was created');
      expect(response.body.data).toEqual({
        id: '02',
        first_name: 'Joe',
        last_name: 'Bloggs',
        email: 'jbloggs@mail.com',
        username: 'jbloggs',
        is_verified: false,
        role: 'user',
      });
      expect(response.body.data.is_verified).toBeFalsy();
    });

    it('throws an error when registration details are missing', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'jbloggs',
        password: 'secret1',
        email: 'me@mail.com',
        lastName: '',
        firstName: 'Joe',
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Form fields are incomplete');
    });
  });
});
