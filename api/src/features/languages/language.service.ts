import type { protos } from '@google-cloud/translate';
import { TranslationServiceClient } from '@google-cloud/translate';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { InternalServerError } from '../../errors/InternalServerError.js';
import { TooManyRequestsError } from '../../errors/TooManyRequestsError.js';
import redisClient from '../../redis/client.js';

type SupportedLanguage = protos.google.cloud.translation.v3.ISupportedLanguage;
type Translation = protos.google.cloud.translation.v3.ITranslation;

const GRPC_CODE = {
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  PERMISSION_DENIED: 7,
  RESOURCE_EXHAUSTED: 8,
  UNAUTHENTICATED: 16,
  UNAVAILABLE: 14,
} as const;

const { GCS_CLIENT_EMAIL, GCS_PRIVATE_KEY, GCS_PROJECT_ID, GCS_PROJECT_LOCATION } = env;

const projectId = GCS_PROJECT_ID;
const location = GCS_PROJECT_LOCATION;

const translationClient = new TranslationServiceClient({
  projectId,
  credentials: {
    client_email: GCS_CLIENT_EMAIL,
    private_key: GCS_PRIVATE_KEY,
  },
});

const cacheKey = 'google:supported-languages';
const cacheTtlSeconds = 60 * 60 * 24;

export const filterLanguages = (languages: SupportedLanguage[], query: string = '') => {
  if (!query) return languages;

  const q = query.toLowerCase();

  return languages.filter((language) => {
    return language.displayName?.toLowerCase().includes(q);
  });
};

export async function getGoogleSupportedLanguages(query?: string) {
  const cachedLanguages = await redisClient.get(cacheKey);

  if (cachedLanguages) {
    return filterLanguages(JSON.parse(cachedLanguages), query);
  }

  const [response] = await translationClient.getSupportedLanguages({
    parent: `projects/${projectId}/locations/${location}`,
    displayLanguageCode: 'en',
  });

  const languages = response.languages ?? [];

  await redisClient.set(cacheKey, JSON.stringify(languages), {
    EX: cacheTtlSeconds,
  });

  return filterLanguages(languages, query);
}

export async function getTranslations({
  sourceLanguageCode,
  targetLanguageCode,
  sourceText,
}: {
  sourceLanguageCode: string;
  targetLanguageCode: string;
  sourceText: string;
}) {
  try {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [sourceText],
      mimeType: 'text/plain',
      sourceLanguageCode,
      targetLanguageCode,
    };

    const [response] = await translationClient.translateText(request);
    const translatedText = response.translations?.[0]?.translatedText;

    return {
      translatedText,
    };
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;

    logger.warn({ code, err: error }, 'Translation request failed');

    if (code === GRPC_CODE.INVALID_ARGUMENT) {
      throw new BadRequestError('The word/phrase could not be translated');
    }
    if (code === GRPC_CODE.RESOURCE_EXHAUSTED) {
      throw new TooManyRequestsError('Translation quota exceeded, please try again later');
    }
    if (
      code === GRPC_CODE.PERMISSION_DENIED ||
      code === GRPC_CODE.UNAUTHENTICATED ||
      code === GRPC_CODE.UNAVAILABLE ||
      code === GRPC_CODE.DEADLINE_EXCEEDED
    ) {
      throw new InternalServerError('Translation service is currently unavailable');
    }
    throw error;
  }
}

export type { Translation };
export default { getGoogleSupportedLanguages, getTranslations };
