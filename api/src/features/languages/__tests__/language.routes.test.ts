import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import { BadRequestError } from '../../../errors/BadRequestError.js';
import { ForbiddenError } from '../../../errors/ForbiddenError.js';
import { InternalServerError } from '../../../errors/InternalServerError.js';
import { TooManyRequestsError } from '../../../errors/TooManyRequestsError.js';
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
    getTranslations: vi.fn(),
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

  describe('POST /languages/translation', () => {
    const validPayload = {
      sourceLanguageCode: 'en',
      targetLanguageCode: 'fr',
      sourceText: 'She has a car',
    };

    it('throws error when user is not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new ForbiddenError('Not authenticated'));
      });

      const response = await request(app).post('/api/v1/languages/translation').send(validPayload);
      expect(response.status).toEqual(403);
    });

    it('returns 400 when the request body fails validation', async () => {
      const response = await request(app)
        .post('/api/v1/languages/translation')
        .send({ sourceLanguageCode: 'en' });

      expect(response.status).toEqual(400);
      expect(languageService.getTranslations).not.toHaveBeenCalled();
    });

    it('returns 200 with the translations on success', async () => {
      vi.mocked(languageService.getTranslations).mockResolvedValueOnce({
        translatedText: 'Elle a une voiture',
      });

      const response = await request(app).post('/api/v1/languages/translation').send(validPayload);

      expect(response.status).toEqual(200);
      expect(response.body.data.translatedText).toEqual('Elle a une voiture');
    });

    it('returns 400 when the phrase could not be translated', async () => {
      vi.mocked(languageService.getTranslations).mockRejectedValueOnce(
        new BadRequestError('The word/phrase could not be translated'),
      );

      const response = await request(app).post('/api/v1/languages/translation').send(validPayload);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('The word/phrase could not be translated');
    });

    it('returns 429 when the translation quota is exceeded', async () => {
      vi.mocked(languageService.getTranslations).mockRejectedValueOnce(
        new TooManyRequestsError('Translation quota exceeded, please try again later'),
      );

      const response = await request(app).post('/api/v1/languages/translation').send(validPayload);

      expect(response.status).toEqual(429);
    });

    it('returns 500 when the translation service is unavailable', async () => {
      vi.mocked(languageService.getTranslations).mockRejectedValueOnce(
        new InternalServerError('Translation service is currently unavailable'),
      );

      const response = await request(app).post('/api/v1/languages/translation').send(validPayload);

      expect(response.status).toEqual(500);
    });
  });
});
