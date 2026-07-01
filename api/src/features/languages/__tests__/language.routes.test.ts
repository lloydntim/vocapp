import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { ForbiddenError } from '../../../errors/ForbiddenError.js';
import authenticate from '../../../middleware/authenticate.js';
import languageService from '../language.service.js';

vi.mock('../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: '01', email: 'jdoe@mail.com', role: 'user' };
    next();
  }),
}));

vi.mock('../language.service.js', () => ({
  default: {
    getGoogleSupportedLanguages: vi.fn(),
  },
}));

describe('LANGUAGE ROUTES', () => {
  describe('GET /languages', async () => {
    it('throws error when user is not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new ForbiddenError('Not authenticated'));
      });
      const response = await request(app).get('/api/v1/languages');
      expect(response.status).toEqual(403);
    });

    it('returns entire language list when no query is set', async () => {
      vi.mocked(languageService.getGoogleSupportedLanguages).mockResolvedValueOnce([
        { languageCode: 'en', displayName: 'English' },
        { languageCode: 'fr', displayName: 'French' },
        { languageCode: 'de', displayName: 'German' },
        { languageCode: 'es', displayName: 'Spanish' },
        { languageCode: 'ja', displayName: 'Japanese' },
      ]);

      const response = await request(app).get('/api/v1/languages');
      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(5);
    });

    it('returns entire language list when no query is set', async () => {
      vi.mocked(languageService.getGoogleSupportedLanguages).mockResolvedValueOnce([
        { languageCode: 'en', displayName: 'English' },
      ]);

      const response = await request(app).get('/api/v1/languages').query({ q: 'french' });
      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(1);
    });
  });
});
