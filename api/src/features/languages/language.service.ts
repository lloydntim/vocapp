import { TranslationServiceClient, protos } from '@google-cloud/translate';
import env from '../../config/env.js';
import redisClient from '../../redis/client.js';

type SupportedLanguage = protos.google.cloud.translation.v3.ISupportedLanguage;

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

export default { getGoogleSupportedLanguages };
