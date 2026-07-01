import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { BadRequestError } from '../../../errors/BadRequestError.js';
import { UnauthorizedError } from '../../../errors/UnauthorizedError.js';
import { UserPlan, UserRole } from '../../../generated/prisma/enums.js';
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  verifyUser,
} from '../auth.service.js';

vi.mock('../auth.service.js', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetUserPassword: vi.fn(),
  rotateRefreshToken: vi.fn(),
  verifyUser: vi.fn(),
}));

vi.mock('../../../shared/email/email.service.js', () => ({
  default: class {
    sendVerificationEmail = vi.fn();
    sendResetPasswordEmail = vi.fn();
    sendWelcomeEmail = vi.fn();
  },
}));

vi.mock('../../../shared/email/nodemailer.provider.js', () => ({
  NodeMailerProvider: class {
    send = vi.fn();
  },
}));

const mockUserData = {
  id: '02',
  firstName: 'Joe',
  lastName: 'Bloggs',
  email: 'jbloggs@mail.com',
  username: 'jbloggs',
  isVerified: false,
  role: UserRole.USER,
  plan: UserPlan.FREE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AUTH ROUTES', () => {
  describe('POST /auth/login', async () => {
    it('returns ok when login successful', async () => {
      vi.mocked(loginUser).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        userData: mockUserData,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'jbloggs', password: 'secret12' });

      const setCookieHeader = response.headers['set-cookie'];
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [];
      const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('SameSite=Lax');

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User is logged in');
      expect(response.body.accessToken).toEqual('access-token');
      expect(response.body.data.isVerified).toBeFalsy();
    });

    it('returns 400 when login details are invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: '', password: 'secret12' });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('The form data is invalid');
    });

    it('returns 401 when username or password is wrong', async () => {
      vi.mocked(loginUser).mockRejectedValue(
        new UnauthorizedError('Wrong username or password, please try again'),
      );
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'username1', password: 'wrongpassword' });

      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Wrong username or password, please try again');
    });
  });

  describe('POST /auth/register', async () => {
    it('returns 201 when registration successful', async () => {
      vi.mocked(registerUser).mockResolvedValue({
        userData: mockUserData,
        verificationToken: 'verify-token',
      });

      const response = await request(app).post('/api/v1/auth/register').send({
        username: 'jbloggs',
        password: 'secret12',
        email: 'me@mail.com',
        lastName: 'Bloggs',
        firstName: 'Joe',
      });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('User was created');
      expect(response.body.data.isVerified).toBeFalsy();
    });

    it('returns 400 when registration details are missing', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        username: 'jbloggs',
        password: 'secret12',
        email: 'me@mail.com',
        lastName: '',
        firstName: 'Joe',
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('The form data is invalid');
    });
  });

  describe('POST /auth/verify', () => {
    it('returns 200 and sets refresh token cookie when token is valid', async () => {
      vi.mocked(verifyUser).mockResolvedValue({
        newAccessToken: 'access-token',
        newRefreshToken: 'refresh-token',
        userId: '01',
      });

      const response = await request(app)
        .post('/api/v1/auth/verify')
        .send({ token: 'valid-verify-token' });

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('User has been verified');
      expect(response.body.accessToken).toEqual('access-token');
    });

    it('returns 400 when token is missing', async () => {
      const response = await request(app).post('/api/v1/auth/verify').send({ token: '' });

      expect(response.status).toEqual(400);
    });

    it('returns 401 when token is invalid or expired', async () => {
      vi.mocked(verifyUser).mockRejectedValue(
        new UnauthorizedError('Verify Token invalid or expired'),
      );

      const response = await request(app).post('/api/v1/auth/verify').send({ token: 'expired-token' });

      expect(response.status).toEqual(401);
    });
  });

  describe('POST /auth/forgotpassword', () => {
    it('returns 200 when reset email is sent', async () => {
      vi.mocked(requestPasswordReset).mockResolvedValue({ rawResetToken: 'raw-token' });

      const response = await request(app)
        .post('/api/v1/auth/forgotpassword')
        .send({ email: 'user@example.com' });

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Password reset process has been started');
    });

    it('returns 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgotpassword')
        .send({ email: 'not-an-email' });

      expect(response.status).toEqual(400);
    });

    it('returns 400 when email is not registered', async () => {
      vi.mocked(requestPasswordReset).mockRejectedValue(
        new BadRequestError('Reset token is invalid or expired'),
      );

      const response = await request(app)
        .post('/api/v1/auth/forgotpassword')
        .send({ email: 'unknown@example.com' });

      expect(response.status).toEqual(400);
    });
  });

  describe('POST /auth/resetpassword', () => {
    it('returns 200 when password is reset successfully', async () => {
      vi.mocked(resetUserPassword).mockResolvedValue({
        id: 'cred-1',
        userId: 'user-1',
        passwordHash: 'new-hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/resetpassword')
        .send({ token: 'reset-token', password: 'newpassword1' });

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Password updated successfully');
    });

    it('returns 400 when token or password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/resetpassword')
        .send({ token: '', password: 'newpassword1' });

      expect(response.status).toEqual(400);
    });

    it('returns 400 when reset token is invalid or expired', async () => {
      vi.mocked(resetUserPassword).mockRejectedValue(
        new BadRequestError('Reset token is invalid or expired'),
      );

      const response = await request(app)
        .post('/api/v1/auth/resetpassword')
        .send({ token: 'expired-token', password: 'newpassword1' });

      expect(response.status).toEqual(400);
    });
  });
});
